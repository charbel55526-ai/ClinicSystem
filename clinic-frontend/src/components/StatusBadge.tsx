export default function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Confirmed: 'bg-green-100 text-green-700',
        Cancelled: 'bg-red-100 text-red-700',
        Pending: 'bg-yellow-100 text-yellow-700',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}