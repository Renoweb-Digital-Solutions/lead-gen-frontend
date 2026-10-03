"use client";

import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { X, ExternalLink, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

ModuleRegistry.registerModules([AllCommunityModule]);

const renowebTheme = themeQuartz.withParams({
  headerBackgroundColor: "transparent",
  headerTextColor: "#ffffff",
  rowHoverColor: "var(--rw-surface-hover)",
  selectedRowBackgroundColor: "var(--rw-surface-hover)",
  borderColor: "var(--rw-border)",
  oddRowBackgroundColor: "var(--rw-bg)",
  backgroundColor: "var(--rw-surface)",
  foregroundColor: "var(--rw-text)",
  rowBorder: "1px solid var(--rw-border)",
});

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

const COLORS = ["#023dbb", "#4460ef", "#308fef", "#4ec8ef", "#71717a", "#a1a1aa"];
function getAvatarColor(name) {
  if (!name) return COLORS[4];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

// ── Custom Cell Renderers ──

function NameCellRenderer(params) {
  const data = params.data;
  if (!data) return null;

  const name = data.investor_name || data.name || "Unknown Investor";
  const firm = data.firm_name || data.company || "Unknown Firm";
  const initials = getInitials(name);
  const color = getAvatarColor(name);

  return (
    <div className="flex items-center gap-3 h-full cursor-pointer hover:opacity-80 transition-opacity">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <div className="flex flex-col justify-center leading-tight">
        <span className="font-bold text-sm text-[var(--rw-text)]">{name}</span>
        <span className="text-xs text-[var(--rw-text-secondary)] mt-0.5">{firm}</span>
      </div>
    </div>
  );
}

function TypeCellRenderer(params) {
  const type = params.value;
  if (!type || type.toLowerCase() === "unknown") {
    return <span className="text-gray-500 text-xs italic">Unknown</span>;
  }
  return (
    <div className="flex items-center h-full">
      <span className="px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-200 bg-gray-50 text-gray-700 capitalize">
        {type.replace(/_/g, " ")}
      </span>
    </div>
  );
}

function FocusCellRenderer(params) {
  const focus = params.value;
  if (!focus) return <span className="text-gray-400 text-xs">—</span>;
  
  // If array, grab first 2
  let items = Array.isArray(focus) ? focus : String(focus).split(',').map(s => s.trim());
  const displayItems = items.slice(0, 2);
  const extra = items.length - 2;

  return (
    <div className="flex items-center gap-1.5 h-full flex-wrap">
      {displayItems.map((f, i) => (
        <span key={i} className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-50 border border-gray-200 text-gray-600 whitespace-nowrap">
          {f}
        </span>
      ))}
      {extra > 0 && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 text-gray-500">
          +{extra}
        </span>
      )}
    </div>
  );
}

function ScoreCellRenderer(params) {
  const score = parseInt(params.value, 10);
  if (isNaN(score)) return <span className="text-gray-400">—</span>;

  // We use inline styles for the subtle success/warning colors so they work in both modes,
  // blending with the surface color by using low opacity.
  let colorStyle = { background: "var(--rw-surface-hover)", color: "var(--rw-text)", borderColor: "var(--rw-border)" };
  
  if (score >= 85) {
    colorStyle = { background: "rgba(16, 185, 129, 0.15)", color: "var(--rw-text)", borderColor: "rgba(16, 185, 129, 0.3)" }; // Emerald tint
  } else if (score < 50) {
    colorStyle = { background: "rgba(245, 158, 11, 0.15)", color: "var(--rw-text)", borderColor: "rgba(245, 158, 11, 0.3)" }; // Amber tint
  }

  return (
    <div className="flex items-center h-full">
      <span className="px-2.5 py-1 text-xs font-bold rounded-md border" style={colorStyle}>
        {score} / 100
      </span>
    </div>
  );
}

function LocationCellRenderer(params) {
  const loc = params.value;
  return (
    <div className="flex items-center h-full">
      <span className="text-sm text-[var(--rw-text-secondary)] truncate">
        {loc || "—"}
      </span>
    </div>
  );
}

// ── Detail Drawer Component ──

function DetailDrawer({ data, onClose }) {
  if (!data) return null;

  const renderField = (label, value) => {
    if (!value || value === "Unknown" || value === "None") return null;
    return (
      <div className="mb-6">
        <h4 className="text-xs font-bold text-[var(--rw-text-muted)] uppercase tracking-wider mb-2">{label}</h4>
        <p className="text-sm text-[var(--rw-text)] leading-relaxed">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[200] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-[450px] bg-[var(--rw-surface)] border-l border-[var(--rw-border)] shadow-2xl flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[var(--rw-border)] flex items-center justify-between bg-[var(--rw-bg)]">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                style={{ backgroundColor: getAvatarColor(data.investor_name || data.name) }}
              >
                {getInitials(data.investor_name || data.name)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-[var(--rw-text)] leading-tight">{data.investor_name || data.name || "Unknown"}</h3>
                <p className="text-sm text-[var(--rw-text-secondary)]">{data.firm_name || data.company}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[var(--rw-surface-hover)] rounded-full text-[var(--rw-text-muted)] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Action Links */}
            <div className="flex items-center gap-3 mb-8">
              {(data.linkedin || data.linkedin_url) && (
                <a href={data.linkedin || data.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-brand-sky hover:text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-md transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
              {(data.website || data.firm_website) && (
                <a href={data.website || data.firm_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-brand-sky hover:text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-md transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Website
                </a>
              )}
              {data.source && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--rw-text-secondary)] bg-[var(--rw-surface-hover)] px-3 py-1.5 rounded-md">
                  <Info className="w-3.5 h-3.5" /> Source: {data.source}
                </span>
              )}
            </div>

            {/* Core details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-[10px] font-bold text-[var(--rw-text-muted)] uppercase tracking-wider mb-1">Score</h4>
                <div className="text-sm font-bold text-[var(--rw-text)]">{data.fit_score ? `${data.fit_score}/100` : '—'}</div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-[var(--rw-text-muted)] uppercase tracking-wider mb-1">Check Size</h4>
                <div className="text-sm font-medium text-[var(--rw-text-secondary)]">{data.check_size || data.investment_size || '—'}</div>
              </div>
            </div>

            {renderField("Location", data.location || data.headquarters)}
            
            {renderField("Fit Summary", data.fit_summary)}
            
            {renderField("Eligibility Criteria", data.eligibility_criteria)}
            
            {renderField("Investment Stages", data.investment_stage || data.stages)}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


// ── Main Table Component ──

export default function InvestorResultsTable({ data }) {
  const [selectedRowData, setSelectedRowData] = useState(null);

  const colDefs = useMemo(() => [
    {
      headerName: "Investor & Firm",
      field: "investor_name",
      cellRenderer: NameCellRenderer,
      minWidth: 260,
      flex: 2,
    },
    {
      headerName: "Fit Score",
      field: "fit_score",
      cellRenderer: ScoreCellRenderer,
      minWidth: 120,
      flex: 1,
    },
    {
      headerName: "Type",
      field: "investor_type",
      cellRenderer: TypeCellRenderer,
      minWidth: 160,
      flex: 1,
    },
    {
      headerName: "Focus Area",
      field: "industry_focus",
      cellRenderer: FocusCellRenderer,
      minWidth: 220,
      flex: 1.5,
    },
    {
      headerName: "Location",
      field: "location",
      cellRenderer: LocationCellRenderer,
      minWidth: 160,
      flex: 1,
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--rw-text-muted)]">
        No investors found.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="h-full w-full rounded-2xl overflow-hidden border border-[var(--rw-border)] shadow-sm bg-[var(--rw-surface)]">
        <style>
          {`
            /* CRM-Style Spacing */
            .ag-row {
              cursor: pointer !important;
            }
            .ag-cell {
              padding-left: 20px !important;
              padding-right: 20px !important;
              display: flex;
              align-items: center;
              border-bottom: 1px solid var(--rw-border) !important;
            }
            /* Custom Header */
            .ag-header {
              background: linear-gradient(135deg, #023dbb 0%, #308fef 100%) !important;
              border-bottom: none !important;
            }
            .ag-header-cell {
              padding-left: 20px !important;
              padding-right: 20px !important;
            }
            .ag-header-cell-text {
              font-weight: 600;
              letter-spacing: 0.02em;
              color: #ffffff !important;
              text-transform: uppercase;
              font-size: 11px;
            }
            .ag-header-icon, .ag-icon {
              color: rgba(255, 255, 255, 0.8) !important;
            }
          `}
        </style>
        <AgGridReact
          theme={renowebTheme}
          rowData={data}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowHeight={68}
          headerHeight={44}
          pagination={true}
          paginationPageSize={15}
          onRowClicked={(e) => setSelectedRowData(e.data)}
          suppressCellFocus={true}
        />
      </div>

      {/* Side Panel for Row Details */}
      {selectedRowData && (
        <DetailDrawer data={selectedRowData} onClose={() => setSelectedRowData(null)} />
      )}
    </div>
  );
}
