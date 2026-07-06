"use client";

import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Custom Renoweb theme based on Quartz, mapping to our CSS variables for Dark Mode support
const renowebTheme = themeQuartz.withParams({
  headerBackgroundColor: "transparent",
  headerTextColor: "#ffffff",
  rowHoverColor: "var(--rw-surface-hover)",
  selectedRowBackgroundColor: "rgba(48, 143, 239, 0.12)",
  borderColor: "var(--rw-border)",
  oddRowBackgroundColor: "var(--rw-bg)",
  backgroundColor: "var(--rw-surface)",
  foregroundColor: "var(--rw-text)",
});

/**
 * Detects what type of clickable link a column represents based on the field name.
 * Returns: "email" | "phone" | "url" | null
 */
function detectLinkType(fieldName) {
  const f = fieldName.toLowerCase();

  // Email columns
  if (f.includes("email") || f.includes("e_mail")) return "email";

  // Phone columns
  if (f.includes("phone") || f.includes("mobile") || f.includes("tel")) return "phone";

  // LinkedIn columns
  if (f.includes("linkedin")) return "url";

  // Website / domain / URL columns
  if (
    f.includes("website") ||
    f.includes("site") ||
    f.includes("domain") ||
    f.includes("url") ||
    f.includes("homepage")
  ) return "url";

  return null;
}

/**
 * Shared link style for all clickable cells
 */
const linkStyle = {
  color: "#308fef",
  textDecoration: "none",
  cursor: "pointer",
  transition: "color 0.15s ease",
};

/**
 * Cell renderer for email fields — opens mailto: link
 */
function EmailCellRenderer(params) {
  let value = params.value;
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  if (Array.isArray(value)) value = value.join(", ");
  
  return (
    <a href={`mailto:${value}`} style={linkStyle} title={`Email ${value}`}>
      {value}
    </a>
  );
}

/**
 * Cell renderer for phone fields — opens tel: link
 */
function PhoneCellRenderer(params) {
  let value = params.value;
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  if (Array.isArray(value)) value = value.join(", ");
  
  return (
    <a href={`tel:${value}`} style={linkStyle} title={`Call ${value}`}>
      {value}
    </a>
  );
}

/**
 * Cell renderer for URL fields (LinkedIn, website, domain) — opens in new tab.
 * Auto-prepends https:// if missing.
 */
function UrlCellRenderer(params) {
  let value = params.value;
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  
  // If multiple URLs, we'll just link the first one but show all
  const firstUrl = Array.isArray(value) ? value[0] : value;
  const displayValue = Array.isArray(value) ? value.join(", ") : value;
  
  const href = firstUrl.startsWith("http") ? firstUrl : `https://${firstUrl}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
      title={`Open ${firstUrl}`}
    >
      {displayValue}
    </a>
  );
}

export default function ResultsTable({ data }) {
  const [colDefs, setColDefs] = useState([]);

  // Generate column definitions dynamically based on the first row of data.
  // Detects email/phone/linkedin/website columns and assigns clickable cell renderers.
  useMemo(() => {
    if (data && data.length > 0) {
      const firstRow = data[0];
      
      const TARGET_COLUMNS = [
        "firstName", "lastName", "first_name", "last_name", "name", "email", "company", "companyName", "role", "seniority",
        "title", "categoryName", "address", "city", "state", "countryCode", "website",
        "phone", "emails", "linkedIns", "facebooks", "instagrams", "socials",
        "totalScore", "reviewsCount", "rank", "website_status", "opportunity_score",
        "opportunity_tier", "opportunity_reason", "opportunity_signals",
        "identifier_coverage", "coverage_count", "confidence", "url", "placeId", "domain"
      ];
      
      const availableKeys = Object.keys(firstRow);
      
      // Keys from TARGET_COLUMNS that are present (for preferred ordering)
      const orderedKeys = TARGET_COLUMNS.filter((key) => availableKeys.includes(key));
      
      // Keys that are present but not in TARGET_COLUMNS
      const remainingKeys = availableKeys.filter((key) => !TARGET_COLUMNS.includes(key));
      
      const allKeysToDisplay = [...orderedKeys, ...remainingKeys];
      
      const cols = allKeysToDisplay
        .map((key) => {
          const linkType = detectLinkType(key);

          const colDef = {
            field: key,
            headerName: key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            sortable: true,
            filter: true,
            resizable: true,
            minWidth: 150,
            valueFormatter: (params) => {
              if (params.value == null) return "";
              if (typeof params.value === "object") {
                if (Object.keys(params.value).length === 0) return "";
                try {
                  return JSON.stringify(params.value);
                } catch (e) {
                  return String(params.value);
                }
              }
              return String(params.value);
            },
          };

          // Format specific boolean columns as Yes/No
          if (
            key === "claim_this_business" ||
            key === "temporarily_closed" ||
            key === "permanently_closed"
          ) {
            colDef.cellRenderer = (params) => {
              if (params.value === true || params.value === "true") return "Yes";
              if (params.value === false || params.value === "false") return "No";
              return params.value != null ? String(params.value) : "";
            };
          } 
          // Assign the appropriate cell renderer based on detected link type
          else if (linkType === "email") {
            colDef.cellRenderer = EmailCellRenderer;
          } else if (linkType === "phone") {
            colDef.cellRenderer = PhoneCellRenderer;
          } else if (linkType === "url") {
            colDef.cellRenderer = UrlCellRenderer;
          }

          return colDef;
        });
      setColDefs(cols);
    }
  }, [data]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      resizable: true,
      sortable: true,
      filter: true,
    };
  }, []);

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--rw-text-muted)" }}>
        No data available to preview.
      </div>
    );
  }

  return (
    <div
      style={{
        height: 500,
        width: "100%",
        marginTop: 20,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--rw-border)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <style>
        {`
          /* Custom Blue Gradient Header — applied via CSS since themeQuartz params don't support gradients */
          .ag-header {
            background: linear-gradient(135deg, #023dbb 0%, #308fef 100%) !important;
            border-bottom: none !important;
          }
          
          .ag-header-cell-text {
            font-weight: 600;
            letter-spacing: 0.02em;
          }

          .ag-header-cell-label {
            color: #ffffff !important;
          }
          
          /* Sort/Filter icon colors */
          .ag-header-icon {
            color: rgba(255, 255, 255, 0.8) !important;
          }

          .ag-header .ag-icon {
            color: rgba(255, 255, 255, 0.8) !important;
          }
          
          .ag-header-cell-menu-button .ag-icon,
          .ag-header-cell-filter-button .ag-icon {
            color: rgba(255, 255, 255, 0.7) !important;
          }
        `}
      </style>
      <AgGridReact
        theme={renowebTheme}
        rowData={data}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50, 100]}
        rowSelection={{ mode: 'multiRow' }}
      />
    </div>
  );
}
