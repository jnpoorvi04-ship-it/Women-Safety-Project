import AlertCard from "./AlertCard";

export default function AlertModal({
    alerts,
    onDismiss
}) {
    if (alerts.length === 0) return null;

    return (
        <div className="fixed top-5 right-5 z-50 space-y-4">

            {alerts.map(alert => (
                <AlertCard
                    key={alert._id}
                    alert={alert}
                    onDismiss={onDismiss}
                />
            ))}

        </div>
    );
}