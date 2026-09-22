import type { RemoteProject } from 'src/types';

interface ProjectNameFallbacks {
  item: string;
  studio: string;
  customer: string;
}

export function getProjectDisplayNames(project: RemoteProject, language: string, fallbacks: ProjectNameFallbacks) {
  const itemSnapshot = project.itemName;
  const populatedItem = typeof project.itemId === 'object' ? project.itemId.name : undefined;
  const studioSnapshot = project.studioName;
  const populatedStudio = typeof project.studioId === 'object' ? project.studioId.name : undefined;
  const populatedCustomer = typeof project.customerId === 'object' ? project.customerId.name : undefined;

  const localized = (name?: { en: string; he?: string }) => (language === 'he' ? name?.he || name?.en : name?.en);

  return {
    item: localized(itemSnapshot) || localized(populatedItem) || fallbacks.item,
    studio: localized(studioSnapshot) || localized(populatedStudio) || fallbacks.studio,
    customer: project.customerName || populatedCustomer || fallbacks.customer
  };
}

export function projectMatchesSearch(
  project: RemoteProject,
  query: string,
  language: string,
  fallbacks: ProjectNameFallbacks
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;

  const names = getProjectDisplayNames(project, language, fallbacks);
  return [project.title || '', names.item, names.studio, names.customer].some((value) =>
    value.toLocaleLowerCase().includes(normalizedQuery)
  );
}
