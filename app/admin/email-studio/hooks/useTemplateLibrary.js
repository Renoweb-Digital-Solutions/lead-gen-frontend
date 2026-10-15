import { useEffect, useState } from "react";
import { adminEmailApi } from "../../../lib/api";
import { createBlankDraft, draftFromTemplate } from "../constants";

// Own the editable draft and shared library, without coupling them to modal steps.
export default function useTemplateLibrary(initialType, onError) {
  const [library, setLibrary] = useState(null);
  const [draft, setDraft] = useState(createBlankDraft);
  const [typeId, setTypeId] = useState(initialType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadLibrary() {
      try {
        const data = await adminEmailApi();
        if (cancelled) return;
        setLibrary(data);
        const template = data.templates.find(
          (item) => item.type_id === initialType,
        );
        if (template) setDraft(draftFromTemplate(template));
      } catch (error) {
        if (!cancelled) onError(error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLibrary();
    return () => {
      cancelled = true;
    };
  }, [initialType, onError]);

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function selectType(id) {
    setTypeId(id);
    const template = library.templates.find((item) => item.type_id === id);
    setDraft(template ? draftFromTemplate(template) : createBlankDraft());
  }

  async function saveTemplate(asNew, sourceDraft = draft) {
    const creating = asNew || !sourceDraft.templateId;
    const path = creating
      ? "/templates"
      : `/templates/${sourceDraft.templateId}`;
    const saved = await adminEmailApi(
      path,
      {
        type_id: typeId,
        name: sourceDraft.name,
        subject: sourceDraft.subject,
        body: sourceDraft.body,
      },
      creating ? "POST" : "PUT",
    );

    setLibrary((current) => ({
      ...current,
      templates: [
        ...current.templates.filter((item) => item.id !== saved.id),
        saved,
      ],
    }));
    return { ...sourceDraft, ...draftFromTemplate(saved) };
  }

  async function saveType(form) {
    const saved = await adminEmailApi(
      form.id ? `/types/${form.id}` : "/types",
      { name: form.name.trim(), purpose: form.purpose },
      form.id ? "PUT" : "POST",
    );
    setLibrary((current) => ({
      ...current,
      types: [...current.types.filter((type) => type.id !== saved.id), saved],
    }));
  }

  return {
    library,
    draft,
    typeId,
    loading,
    updateDraft,
    replaceDraft: setDraft,
    selectType,
    saveTemplate,
    saveType,
    selectTemplate: (template) => setDraft(draftFromTemplate(template)),
    startBlank: () => setDraft(createBlankDraft()),
  };
}
