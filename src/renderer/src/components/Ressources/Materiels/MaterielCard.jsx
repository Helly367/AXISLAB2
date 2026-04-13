import React, { useState, useMemo } from "react";
import { Edit, Delete, Code, CurrencyExchange, ShoppingCart, Savings, CalendarToday, Category, AttachMoney, Numbers, More, Close } from "@mui/icons-material";
import { formatMontant, formateDate, getDeviseSymbol } from "../../../Services/functions";
import ModifyMateriel from "../Materiels/ModifyMateriel";
import DeleteConfirm from "../../widjets/DeleteConfirm"


const MaterielVoirPlus = ({ open, close, materielVoire, setMaterielVOire, phases }) => {

    const phaseMateriel = phases?.find(p => p.phase_id === materielVoire?.phase_id)

    const handleClose = () => {
        setMaterielVOire(null)
        close();
    }


    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-primary p-2 flex justify-between items-center sticky top-0">
                    <h2 className="text-2xd text-white font-bold">
                        Detail du materiel
                    </h2>

                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                <div className="flex flex-col items-start gap-4 p-6">

                    <div className="flex flex-col gap-3 w-full border border-gray-200 shadow-sm p-4 rounded-xl">
                        <h2 className="text-gray-900 font-medium text-2xd ">
                            Description
                        </h2>
                        <p>{materielVoire.description}</p>
                    </div>

                    <div className="flex flex-col gap-3 w-full border border-gray-200 shadow-sm p-4 rounded-xl  ">
                        <h2 className="text-gray-900 font-medium text-2xd ">
                            Fournisseur du materiel
                        </h2>
                        <p>{materielVoire.fournisseur || 'non défini'}</p>
                    </div>

                    <div className="flex flex-col gap-3 w-full border border-gray-200 shadow-sm p-4 rounded-xl  ">
                        <h2 className="text-gray-900 font-medium text-2xd ">
                            Phase
                        </h2>
                        <p>{phaseMateriel?.title || 'non défini'}</p>
                    </div>

                    <div className="flex flex-col gap-3 w-full border border-gray-200 shadow-sm p-4 rounded-xl  ">
                        <h2 className="text-gray-900 font-medium text-2xd ">
                            Date d'ajoute
                        </h2>
                        <p>{formateDate(materielVoire?.created_at) || 'non défini'}</p>
                    </div>




                </div>

            </div>




        </div>
    )
}

const TableMateriel = ({ materielsFiltres, devise, handleVoirePlus, setMaterielVOire, setIsEditModalOpen, setOpenDelete }) => {

    const generateStatus = (status) => {

        if (!status) return null;

        if (status === "en_attente") {
            return {
                title: "en attente",
                style: 'bg-orange-50 text-orange-600'
            }
        } else if (status === "dispinible") {
            return {
                title: "disponible",
                style: "bg-green-50 text-green-600"
            }
        } else if (status === 'suspendu') {
            return {
                title: "suspendu",
                style: 'bg-red-50 text-red-600'
            }
        } else {
            return "soso";
        }
    }



    return (
        <div className="w-full overflow-x-auto overflow-y-auto rounded-xl border border-gray-200  h-100%">

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-linear-to-r from-gray-50 to-gray-100 text-gray-800 text-sm font-bold">
                        <th className="p-4 text-left font-semibold">Nom</th>
                        <th className="p-4 text-left font-semibold">Categorie</th>
                        <th className="p-4 text-left font-semibold">Prix</th>
                        <th className="p-4 text-left font-semibold">Quantité</th>
                        <th className="p-4 text-left font-semibold">Statut</th>
                        <th className="p-4 text-left font-semibold">Action</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {materielsFiltres.map((materiel, index) => {


                        return (
                            <tr key={materiel.materiel_id || index}>

                                {/* phase title */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-1 h-8 rounded-full"
                                            style={{ backgroundColor: '#3B82F6' }}
                                        ></div>
                                        <div>
                                            <span className="font-medium text-gray-800">{materiel.nom}</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <Code sx={{ fontSize: 14 }} />
                                                <span>ID: {materiel.materiel_id || `PH-${index + 1}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* categorie */}
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Category sx={{ fontSize: 18, color: '#6B7280' }} />
                                        <span className="font-medium text-gray-800">
                                            {materiel.categorie}
                                        </span>
                                    </div>
                                </td>



                                {/* prix */}
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <AttachMoney sx={{ fontSize: 18, color: '#6B7280' }} />
                                        <span className="font-medium text-gray-800">
                                            {formatMontant(materiel.prix || 0)} {devise}
                                        </span>
                                    </div>
                                </td>

                                {/* quantite */}
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Numbers sx={{ fontSize: 18, color: '#6B7280' }} />
                                        <span className="font-medium text-gray-800">
                                            {Number(materiel.quantite)}
                                        </span>
                                    </div>
                                </td>

                                {/* status */}
                                <td className="p-4">
                                    {(() => {
                                        const status = generateStatus(materiel.statut);

                                        return (
                                            <div className={`flex items-center gap-2 p-2 ${status.style} `}>
                                                <span className="font-medium ">
                                                    {status.title}

                                                </span>
                                            </div>

                                        )
                                    })()}

                                </td>

                                {/* actions */}
                                <td className="p-4">
                                    <div className="grid grid-cols-3 gap-3">

                                        <button
                                            onClick={() => {
                                                setMaterielVOire(materiel);
                                                handleVoirePlus();
                                            }}
                                            className="bg-orange-100 text-orange-600 p-1.2 rounded-[5px] shadow-[5px]"
                                            title="Voir plus..."
                                        >
                                            <More />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setIsEditModalOpen(true);
                                                setMaterielVOire(materiel)
                                            }}
                                            className="bg-green-100 text-green-600 p-1 rounded-[5px] shadow-[5px]"
                                            title="Modifier le materiel"
                                        >
                                            <Edit />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setOpenDelete(true);
                                                setMaterielVOire(materiel)
                                            }}
                                            className="bg-red-100 text-red-600 p-1 rounded-[5px] shadow-[5px]"
                                            title="supprimer le materiel"
                                        >
                                            <Delete />
                                        </button>
                                    </div>
                                </td>



                            </tr>
                        );
                    })}
                </tbody>

                {/* Pied de tableau avec totaux */}
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                    <tr>
                        <td className="p-4 font-semibold text-gray-800">Totaux</td>
                        <td className="p-4 font-semibold text-gray-800 text-2xd">
                            {formatMontant(materielsFiltres.reduce((acc, m) => acc + (m.prix || 0) * (m.quantite || 0), 0))}  {devise}
                        </td>



                    </tr>
                </tfoot>
            </table>
        </div>
    )
}


const MaterielCard = ({ materiels, devise, phases, project, budget, deleteMateriel, setPhases }) => {

    const [filter, setFilter] = useState(0);
    const [openVoirePlus, setOpenVoirePlus] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [materielVoire, setMaterielVOire] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    const PhasesDuProjet = useMemo(() => {
        if (!Array.isArray(phases) || !project?.projet_id) return [];
        return phases.filter(m => m?.projet_id === project.projet_id);
    }, [phases, project?.projet_id]);

    const materielsFiltres = useMemo(() => {
        if (!Array.isArray(materiels)) return [];

        return materiels.filter(materiel => {
            if (!materiel) return false;

            // 🔍 FILTRE RECHERCHE
            const search = searchTerm.toLowerCase();
            const matchSearch =
                !searchTerm ||
                materiel.nom?.toLowerCase().includes(search) ||
                materiel.categorie?.toLowerCase().includes(search) ||
                materiel.description?.toLowerCase().includes(search) ||
                String(materiel.prix).replace(/\s/g, '').includes(search) ||
                materiel.fournisseur?.toLowerCase().includes(search);


            // 🎯 FILTRE PHASE
            const matchPhase =
                !filter || filter == 0
                    ? true
                    : materiel.phase_id === Number(filter);

            return matchSearch && matchPhase;
        });
    }, [materiels, searchTerm, filter]);

    console.log(filter);




    const handlerDelete = async () => {
        setLoading(true);

        const projet_id = project?.projet_id;
        const materiel_id = materielVoire?.materiel_id;
        const phase_id = materielVoire?.phase_id;

        await new Promise(resolve => setTimeout(resolve, 3000))
        const result = await deleteMateriel(projet_id, materiel_id, phase_id);
        console.log(result);

        if (!result.success) {
            console.error(result.error || result.errors);
            setLoading(false);
            return;
        }

        // ✅ Correction : result.data est directement la phase mise à jour
        setPhases(prev =>
            Array.isArray(prev)
                ? prev.map(p =>
                    p.phase_id === result.data.phase.phase_id ? result.data.phase : p
                )
                : []
        );
        handleClose();
    }


    const handleClose = () => {
        setLoading(false);
        setOpenDelete(false);
    }



    return (
        <div className="w-full bg-white rounded-lg shadow-md p-6 group relative mt-4">

            <div className="flex items-center w-full gap-4">
                <input type="text"
                    placeholder="recherchez un materiel"
                    value={searchTerm}
                    maxLength={80} // limite stricte
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        if (e.target.value.length > 80) {
                            e.target.value = e.target.value.slice(0, 80);
                        }

                    }}
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <select name="" id=""
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-80 px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="0">Toutes les phases</option>
                    {PhasesDuProjet.map(phase => (
                        <option key={phase.phase_id} value={phase.phase_id}>
                            {phase.title}
                        </option>
                    ))}



                </select>

            </div>


            <div className="flex flex-col bg-white w-full p-4 gap-6 rounded-2xl  border border-gray-100 mt-4">
                {/* En-tête avec statistiques */}
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl text-gray-800 font-bold">
                        Liste des materiels
                    </h3>

                    <div className="text-right flex gap-2">
                        <p className="text-sm text-gray-500">Total materiels</p>
                        <p className="font-semibold text-gray-800">{materielsFiltres.length}</p>
                    </div>


                </div>

                {materielsFiltres.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg  mt-4">
                        <p className="text-gray-500 text-lg font-medium">

                            <span className='ml-2'> Aucun materiel disponible pour cette phase</span>

                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            « Ajouter des matieriels. »
                        </p>


                    </div>
                ) : (
                    <TableMateriel
                        materielsFiltres={materielsFiltres}
                        devise={devise}
                        handleVoirePlus={() => setOpenVoirePlus(true)}
                        setMaterielVOire={setMaterielVOire}
                        setIsEditModalOpen={setIsEditModalOpen}
                        setOpenDelete={setOpenDelete}
                    />
                )}

            </div>

            {openVoirePlus && (
                <MaterielVoirPlus
                    open={openVoirePlus}
                    close={() => setOpenVoirePlus(false)}
                    materielVoire={materielVoire}
                    setMaterielVOire={setMaterielVOire}
                    phases={phases}
                    devise={devise}
                />

            )}

            {isEditModalOpen && (
                <ModifyMateriel
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    phases={phases}
                    materielVoire={materielVoire}
                    project={project}
                    budget={budget}


                />
            )}

            {openDelete && (
                <DeleteConfirm
                    open={openDelete}
                    onClose={() => setOpenDelete(false)}
                    message={`Voulez vous vraiment supprimé le materiel ${materielVoire.nom}`}
                    loading={loading}
                    onConfirm={handlerDelete}
                />

            )}

        </div>

    );


};

export default MaterielCard;