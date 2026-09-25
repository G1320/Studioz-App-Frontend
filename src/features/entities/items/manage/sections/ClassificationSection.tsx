import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useMusicCategories,
  useMusicSubCategories,
  useRemoteMusicSubCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useMusicGenres,
  useCategories,
  useGenres,
  toCurrentMainCategoryLabel,
  toEnglishMainCategory,
  isMusicMainCategory,
  isPhotoMainCategory
} from '@shared/hooks';
import { Item } from 'src/types/index';
import { SectionChrome } from '@features/entities/studios/manage/sections/SectionChrome';
import { useItemSectionSave } from '../useItemSectionSave';

interface ClassificationSectionProps {
  item: Item;
}

export const ClassificationSection = ({ item }: ClassificationSectionProps) => {
  const { t, i18n } = useTranslation('forms');
  const musicCategories = useMusicCategories();
  const photoCategories = usePhotoCategories();
  const musicSubCategories = useMusicSubCategories();
  const remoteMusicSubCategories = useRemoteMusicSubCategories();
  const photoSubCategories = usePhotoSubCategories();
  const genres = useMusicGenres();
  const { getEnglishByDisplay } = useCategories();
  const { getEnglishByDisplay: getGenreEnglish } = useGenres();
  const { savePatch, isSaving } = useItemSectionSave(item, item._id);

  const isRemote =
    item.serviceDeliveryType === 'remote' || (item as Item & { remoteService?: boolean }).remoteService === true;

  const localize = useCallback(
    (cats: string[]) =>
      cats.map((cat) => toCurrentMainCategoryLabel(cat, musicCategories[0], photoCategories[0])),
    [musicCategories, photoCategories]
  );

  const getSubOptions = useCallback(
    (cats: string[], remote: boolean) => {
      if (cats.some((c) => isMusicMainCategory(c, musicCategories[0]))) {
        return remote ? remoteMusicSubCategories : musicSubCategories;
      }
      return photoSubCategories;
    },
    [musicCategories, musicSubCategories, remoteMusicSubCategories, photoSubCategories]
  );

  const [selectedCategories, setSelectedCategories] = useState(() =>
    item.categories?.length ? localize(item.categories) : musicCategories
  );
  const [subOptions, setSubOptions] = useState(() =>
    getSubOptions(item.categories?.length ? localize(item.categories) : musicCategories, isRemote)
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState(item.subCategories || []);
  const [selectedGenres, setSelectedGenres] = useState(item.genres || []);

  useEffect(() => {
    const cats = item.categories?.length ? localize(item.categories) : musicCategories;
    setSelectedCategories(cats);
    setSubOptions(getSubOptions(cats, isRemote));
    setSelectedSubCategories(item.subCategories || []);
    setSelectedGenres(item.genres || []);
  }, [item._id, item.categories, item.subCategories, item.genres, localize, getSubOptions, musicCategories, isRemote]);

  useEffect(() => {
    setSelectedCategories((prev) => {
      const next = localize(prev);
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [i18n.language, localize]);

  const baselineCats = item.categories?.length ? localize(item.categories) : musicCategories;
  const isDirty =
    JSON.stringify(selectedCategories.map(toEnglishMainCategory)) !==
      JSON.stringify(baselineCats.map(toEnglishMainCategory)) ||
    JSON.stringify(selectedSubCategories) !== JSON.stringify(item.subCategories || []) ||
    JSON.stringify(selectedGenres) !== JSON.stringify(item.genres || []);

  const selectMain = (label: string) => {
    if (isRemote && isPhotoMainCategory(label, photoCategories[0])) return;
    const next = [label];
    setSelectedCategories(next);
    const opts = getSubOptions(next, isRemote);
    setSubOptions(opts);
    setSelectedSubCategories(opts[0] ? [opts[0]] : []);
  };

  const toggleMulti = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const mainOptions = isRemote ? [musicCategories[0]] : [musicCategories[0], photoCategories[0]];

  return (
    <SectionChrome
      title={t('manage.item.sections.classification', 'Classification')}
      subtitle={t('manage.item.classification.subtitle', 'Category, specialties, and genres.')}
      isDirty={isDirty}
      isSaving={isSaving}
      onDiscard={() => {
        const cats = item.categories?.length ? localize(item.categories) : musicCategories;
        setSelectedCategories(cats);
        setSubOptions(getSubOptions(cats, isRemote));
        setSelectedSubCategories(item.subCategories || []);
        setSelectedGenres(item.genres || []);
      }}
      onSave={() =>
        savePatch({
          categories: selectedCategories.map(toEnglishMainCategory),
          subCategories: selectedSubCategories.map((s) => getEnglishByDisplay(s)),
          genres: selectedGenres.map((g) => getGenreEnglish(g))
        })
      }
    >
      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body">
          <div className="studio-manage-field">
            <span className="studio-manage-label">{t('form.categories.label', 'Category')}</span>
            <div className="studio-manage-choice-grid">
              {mainOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`studio-manage-choice ${
                    selectedCategories[0] === opt ? 'is-selected' : ''
                  }`}
                  onClick={() => selectMain(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-manage-field">
            <span className="studio-manage-label">
              {t('form.subCategories.label', 'Specialties')}
            </span>
            <div className="item-manage-chips">
              {subOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`item-manage-chip ${
                    selectedSubCategories.includes(opt) ? 'is-selected' : ''
                  }`}
                  onClick={() => toggleMulti(selectedSubCategories, opt, setSelectedSubCategories)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-manage-field">
            <span className="studio-manage-label">{t('form.sections.genres', 'Genres')}</span>
            <div className="item-manage-chips item-manage-chips--bubble">
              {genres.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`item-manage-chip ${selectedGenres.includes(opt) ? 'is-selected' : ''}`}
                  onClick={() => toggleMulti(selectedGenres, opt, setSelectedGenres)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionChrome>
  );
};
