import { ProjectsProvider } from "../hooks/useProjets";
import { PhaseProvider } from "../hooks/usePhase";
import { JalonProvider } from "../hooks/useJalon";
import { MembresProvider } from "../hooks/useMembers";
import { BudgetsProvider } from "../hooks/useBudgets";
import { MaterielProvider } from "../hooks/useMateriels";
import { CampagnesProvider } from "../hooks/useCampagnes";


export default function AppProviders({ children }) {
    return (
        <ProjectsProvider>
            <BudgetsProvider>
                <CampagnesProvider>
                    <MembresProvider>
                        <PhaseProvider>
                            <MaterielProvider>
                                <JalonProvider>
                                    {children}
                                </JalonProvider>
                            </MaterielProvider>
                        </PhaseProvider>
                    </MembresProvider>
                </CampagnesProvider>
            </BudgetsProvider>
        </ProjectsProvider>
    );
}