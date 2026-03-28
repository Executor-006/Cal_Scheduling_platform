import Shell from '../components/layout/Shell';
import TopBar from '../components/layout/TopBar';
import AvailabilityForm from '../components/availability/AvailabilityForm';
import useAvailability from '../hooks/useAvailability';

export default function Availability() {
  const { availability, loading, save } = useAvailability();

  return (
    <Shell>
      <TopBar title="Availability" subtitle="Configure times when you are available for bookings." />
      <AvailabilityForm availability={availability} onSave={save} loading={loading} />
    </Shell>
  );
}
