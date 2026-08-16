import '../styles/_index.scss';
import { EditStudioForm } from '@features/entities/studios/forms/EditStudioForm';
import { StickyRemoteAudioBar } from '@shared/components/audio';

const EditStudioPage = () => {
  return (
    <section className="edit-studio-page">
      <EditStudioForm />
      <StickyRemoteAudioBar />
    </section>
  );
};
export default EditStudioPage;
