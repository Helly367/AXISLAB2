<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ">
    {/* Carte type de projet */}
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
            {typeInfo.icon}
            <h3 className="font-semibold text-gray-700">Type</h3>
        </div>
        <span className={`${typeInfo.bg} ${typeInfo.text} px-3 py-1 rounded-full text-sm font-medium`}>
            {typeInfo.label}
        </span>
    </div>

    {/* Carte budget total */}
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-700 mb-2">Budget total</h3>
        <p className="text-3xl font-bold text-primary ">
            {formatMontant(budgetConfig.montantTotal)}
        </p>
        {budgetConfig.reserve > 0 && (
            <p className="text-sm text-gray-500 mt-2">
                Réserve: {formatMontant(budgetConfig.reserve)}
            </p>
        )}
        {budgetConfig.devise !== budgetConfig.deviseOrigine && (
            <p className="text-xs text-gray-400 mt-1">
                Converti depuis {budgetConfig.deviseOrigine}
            </p>
        )}
    </div>

    {/* Carte dépenses */}
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-700 mb-2">Dépensé</h3>
        <p className="text-3xl font-bold text-orange-500">
            {formatMontant(stats.totalDepenses)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
                className={`rounded-full h-2 ${stats.pourcentageUtilise >= 100 ? 'bg-red-500' :
                    stats.pourcentageUtilise >= budgetConfig.alertes.seuilAlerte ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                style={{ width: `${Math.min(stats.pourcentageUtilise, 100)}%` }}
            />
        </div>
        <p className="text-sm text-gray-500 mt-1">
            {stats.pourcentageUtilise.toFixed(1)}% utilisé
        </p>
    </div>

    {/* Carte reste */}
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-700 mb-2">Reste</h3>
        <p className={`text-3xl font-bold ${stats.reste >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatMontant(Math.abs(stats.reste))}
            {stats.reste < 0 && ' (dépassement)'}
        </p>
        {stats.reste < 0 && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-2 ">
                <Warning fontSize="small" /> Dépassement
            </p>
        )}
    </div>
</div>