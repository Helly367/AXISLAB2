import React, { useState } from 'react';
import {
    Receipt,
    Add,
    Delete,
    Edit,
    FilterList,
    Warning,
    CheckCircle,
    Description,
    AttachMoney,
    CalendarToday
} from "@mui/icons-material";

const ExpensesTracker = ({ budgetConfig, phases, onAddDepense, formatMontant }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [filterPhase, setFilterPhase] = useState('all');
    const [filterDate, setFilterDate] = useState('');
    const [newDepense, setNewDepense] = useState({
        libelle: '',
        montant: '',
        phaseId: '',
        date: new Date().toISOString().split('T')[0],
        type: 'normal',
        description: '',
        fournisseur: '',
        reference: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newDepense.libelle || !newDepense.montant || !newDepense.phaseId) return;

        onAddDepense({
            ...newDepense,
            montant: Number(newDepense.montant)
        });

        setNewDepense({
            libelle: '',
            montant: '',
            phaseId: '',
            date: new Date().toISOString().split('T')[0],
            type: 'normal',
            description: '',
            fournisseur: '',
            reference: ''
        });
        setShowAddForm(false);
    };

    // Filtrer les dépenses
    const filteredDepenses = budgetConfig.depenses.filter(d => {
        if (filterPhase !== 'all' && d.phaseId !== parseInt(filterPhase)) return false;
        if (filterDate && d.date !== filterDate) return false;
        return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Statistiques des dépenses
    const stats = {
        total: filteredDepenses.reduce((acc, d) => acc + d.montant, 0),
        count: filteredDepenses.length,
        parPhase: {}
    };

    filteredDepenses.forEach(d => {
        stats.parPhase[d.phaseId] = (stats.parPhase[d.phaseId] || 0) + d.montant;
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Receipt className="text-blue-600" />
                    Suivi des dépenses
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Add /> Nouvelle dépense
                </button>
            </div>

            {/* Formulaire d'ajout */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-700 mb-4">Ajouter une dépense</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Libellé *</label>
                            <input
                                type="text"
                                value={newDepense.libelle}
                                onChange={(e) => setNewDepense({ ...newDepense, libelle: e.target.value })}
                                className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400"
                                placeholder="Ex: Achat matériel"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Montant *</label>
                            <input
                                type="number"
                                value={newDepense.montant}
                                onChange={(e) => setNewDepense({ ...newDepense, montant: e.target.value })}
                                className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400"
                                placeholder="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Phase *</label>
                            <select
                                value={newDepense.phaseId}
                                onChange={(e) => setNewDepense({ ...newDepense, phaseId: e.target.value })}
                                className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400"
                                required>
                                <option value="">Sélectionner une phase</option>
                                {phases.map(phase => (
                                    <option key={phase.id} value={phase.id}>{phase.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Date</label>
                            <input
                                type="date"
                                value={newDepense.date}
                                onChange={(e) => setNewDepense({ ...newDepense, date: e.target.value })}
                                className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Type</label>
                            <select
                                value={newDepense.type}
                                onChange={(e) => setNewDepense({ ...newDepense, type: e.target.value })}
                                className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400">
                                <option value="normal">Budget normal</option>
                                <option value="reserve">Réserve</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Fournisseur</label>
                            <input
                                type="text"
                                value={newDepense.fournisseur}
                                onChange={(e) => setNewDepense({ ...newDepense, fournisseur: e.target.value })}
                                className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400"
                                placeholder="Nom du fournisseur"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1">Description</label>
                        <textarea
                            value={newDepense.description}
                            onChange={(e) => setNewDepense({ ...newDepense, description: e.target.value })}
                            className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400"
                            rows="2"
                            placeholder="Description de la dépense..."
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400 hover:bg-gray-100">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Enregistrer
                        </button>
                    </div>
                </form>
            )}

            {/* Filtres */}
            <div className="flex gap-4 mb-6">
                <select
                    value={filterPhase}
                    onChange={(e) => setFilterPhase(e.target.value)}
                    className="p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400">
                    <option value="all">Toutes les phases</option>
                    {phases.map(phase => (
                        <option key={phase.id} value={phase.id}>{phase.title}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400"
                />
                {filterDate && (
                    <button
                        onClick={() => setFilterDate('')}
                        className="text-red-600 hover:text-red-800">
                        Réinitialiser
                    </button>
                )}
            </div>

            {/* Résumé des dépenses filtrées */}
            {filteredDepenses.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-blue-600">Total filtré</p>
                            <p className="text-xl font-bold text-blue-700">{formatMontant(stats.total)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-600">Nombre de dépenses</p>
                            <p className="text-xl font-bold text-blue-700">{stats.count}</p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-600">Moyenne</p>
                            <p className="text-xl font-bold text-blue-700">
                                {stats.count > 0 ? formatMontant(stats.total / stats.count) : formatMontant(0)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Liste des dépenses */}
            {filteredDepenses.length > 0 ? (
                <div className="space-y-3">
                    {filteredDepenses.map((depense) => {
                        const phase = phases.find(p => p.id === depense.phaseId);
                        const budgetPhase = budgetConfig.repartition[depense.phaseId] || 0;
                        const depensesPhase = budgetConfig.depenses
                            .filter(d => d.phaseId === depense.phaseId)
                            .reduce((acc, d) => acc + d.montant, 0);
                        const alerteDepassement = depensesPhase > budgetPhase;

                        return (
                            <div key={depense.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${alerteDepassement ? 'border-red-200 bg-red-50' : ''
                                }`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{depense.libelle}</h4>
                                        <p className="text-sm text-gray-500">
                                            {phase?.title} • {new Date(depense.date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-red-500">
                                            {formatMontant(depense.montant)}
                                        </p>
                                        {depense.type === 'reserve' && (
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                                Réserve
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {depense.description && (
                                    <p className="text-sm text-gray-600 mb-2">{depense.description}</p>
                                )}

                                <div className="flex items-center gap-4 text-xs">
                                    {depense.fournisseur && (
                                        <span className="text-gray-500">Fournisseur: {depense.fournisseur}</span>
                                    )}
                                    {depense.reference && (
                                        <span className="text-gray-500">Réf: {depense.reference}</span>
                                    )}
                                    {alerteDepassement && (
                                        <span className="text-red-500 flex items-center gap-1">
                                            <Warning fontSize="small" />
                                            Dépassement sur cette phase
                                        </span>
                                    )}
                                </div>

                                {/* Justificatifs liés */}
                                {depense.justificatifs && depense.justificatifs.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">
                                            {depense.justificatifs.length} justificatif(s)
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Receipt className="text-gray-400 text-5xl mx-auto mb-3" />
                    <p className="text-gray-500">Aucune dépense enregistrée</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-4 text-blue-600 hover:text-blue-800">
                        Ajouter une dépense
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpensesTracker;