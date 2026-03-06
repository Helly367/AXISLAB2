import DashboardSidebar from "./DashboardSidebar";
import DashboardContent from "./DashboardContent"

const DashboardLayout = ({ project }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* SIDEBAR - FIXE */}
            <DashboardSidebar
                membersCount={0}
                materielsCount={0}
                tasksEnCours={0}
                campagnesEnCours={0}
                notificationsCount={0}
            />

            {/* CONTENU SCROLLABLE */}
            <div className="flex-1 overflow-y-auto h-screen">
                <DashboardContent project={project} />
            </div>
        </div>
    );
};

export default DashboardLayout;