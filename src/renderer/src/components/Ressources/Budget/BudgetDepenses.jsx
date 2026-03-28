import { formateDate, formatMontant } from '../../../Services/functions';
import { devises } from '../../../Services/listes';
import {
    Code,
    CurrencyExchange,
    ShoppingCart,
    Savings,
    CalendarToday,
    TrendingUp,
    TrendingDown
} from "@mui/icons-material";


const depenses = [
    {
        id: 1,
        depense: "Achat PC",
        phase: "Developpement",
        categorie: "Materiel",
        montant: 350,
        date: "2024-01-15",
    },
    {
        id: 2,
        depense: "Achat Imprimente",
        phase: "Developpement",
        categorie: "Materiel",
        montant: 1000,
        date: "2024-01-15",
    },
    {
        id: 3,
        depense: "Pub Facebook",
        phase: "Deployement",
        categorie: "Campagne",
        montant: 800,
        date: "2024-01-15",
    },
    {
        id: 4,
        depense: "Achat Serveur",
        phase: "Developpement",
        categorie: "Risque",
        montant: 3000,
        date: "2024-01-15",
    },
    {
        id: 5,
        depense: "creation affiches et baches",
        phase: "Deployement",
        categorie: "Campagne",
        montant: 600,
        date: "2024-01-15",
    },
    {
        id: 6,
        depense: "Achat Batiment officiel",
        phase: "Conception",
        categorie: "Mobilier",
        montant: 25000,
        date: "2024-01-15",
    }
]

const depensess = [];


// Composant principal amélioré
const BudgetDepenses = ({ devise = 'USD', setIsCreateModalOpen }) => {

    const getDeviseSymbol = (code) =>
        devises.find((d) => d.code === code)?.symbole || code;


    return (
        <div className="flex flex-col bg-white w-full p-8 gap-6 rounded-2xl shadow-lg border border-gray-100 mt-4 mb-8">
            {/* En-tête avec statistiques */}
            <div className="flex justify-between items-center">
                <h3 className="text-2xl text-gray-800 font-bold">
                    Liste des dépenses
                </h3>


                <div className="flex items-center gap-4">
                    <div className="text-right flex gap-2">
                        <p className="text-sm text-gray-500">Devise</p>
                        <p className="font-semibold text-gray-800">{getDeviseSymbol(devise)}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200"></div>
                    <div className="text-right flex gap-2">
                        <p className="text-sm text-gray-500">Total dépenses</p>
                        <p className="font-semibold text-gray-800">{depensess.length}</p>
                    </div>
                </div>
            </div>

            {depensess && depensess.length == 0 ? (
                <div className="text-center py-16 ">
                    <p className="text-gray-500 text-lg font-medium">
                        Aucun dépense éffectuer pour le moment
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        « Découpez votre projet en plusieurs depenses pour mieux le structurer et le gérer efficacement. »
                    </p>

                </div>

            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 ">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-linear-to-r from-gray-50 to-gray-100 text-gray-800 text-sm font-bold">
                                <th className="p-4 text-left font-semibold">Dépense</th>
                                <th className="p-4 text-left font-semibold">Phase</th>
                                <th className="p-4 text-left font-semibold">Catégorie</th>
                                <th className="p-4 text-left font-semibold">Montant</th>
                                <th className="p-4 text-left font-semibold">Échéance</th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {depenses.map((depense, index) => {


                                return (
                                    <tr
                                        key={depense.id || index}
                                        className="hover:bg-blue-50 transition-all duration-200 group px-4"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">

                                                <div>
                                                    <span className="font-medium text-gray-800">{depense.depense}</span>

                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className="font-medium text-gray-800">
                                                {depense.phase}
                                            </span>

                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-800">
                                                    {depense.categorie}
                                                </span>


                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Savings sx={{ fontSize: 18, color: '#10B981' }} />
                                                    <span className="font-semibold text-green-600 ">
                                                        {formatMontant(depense.montant)} {getDeviseSymbol(devise)}

                                                    </span>
                                                </div>


                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarToday sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <span className="text-gray-700">{formateDate(depense.date)}</span>
                                            </div>
                                        </td>


                                    </tr>
                                );
                            })}
                        </tbody>

                        {/* Pied de tableau avec totaux */}
                        <tfoot className="bg-gray-50 border-t-2 border-gray-200 w-full flex items-center justify-center">
                            <tr className='flex items-center justify-center w-full '>
                                <td className="p-4 font-bold text-black ">Total</td>
                                <td className="p-4 font-bold text-black">
                                    {formatMontant(depenses.reduce((acc, p) => acc + (p.montant || 0), 0))} {getDeviseSymbol(devise)}
                                </td>


                            </tr>
                        </tfoot>
                    </table>
                </div>

            )}




        </div>
    );
};

export default BudgetDepenses;