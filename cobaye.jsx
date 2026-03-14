    {/* Répartition du budget */}
                    <div>
                        <div className='flex justify-between items-center mb-4'>
                            <label className="block text-sm font-medium text-gray-700">
                                Répartition du budget
                            </label>

                            <div className="text-sm bg-gray-100 p-2 rounded-lg">
                                <span className="text-gray-600">Total alloué : </span>
                                <span className={`font-semibold ${totalBudgets && totalBudgets > montantApresReserve
                                    ? 'text-red-600'
                                    : 'text-green-600'
                                    }`}>
                                    {totalBudgets ? totalBudgets.toLocaleString() : '0'} {watchDevise}
                                </span>
                                <span className="text-gray-400 mx-2">/</span>
                                <span className="font-semibold text-gray-700">
                                    {montantApresReserve?.toLocaleString()} {watchDevise}
                                </span>
                            </div>
                        </div>

                        {erreurDepassement && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                <Warning className="text-red-500 mt-0.5" />
                                <div>
                                    <p className="text-red-700 font-medium">Budget dépassé</p>
                                    <p className="text-sm text-red-600">{erreurDepassement}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 rounded-lg p-4 bg-gray-50">

                            {/* Phases */}
                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-2 w-32 font-bold text-gray-700">
                                    Phases
                                </label>
                                <div className='flex-1'>
                                    <input
                                        {...register('phasesBudget', {
                                            required: 'Le budget pour les phases est requis',
                                            min: { value: 0, message: 'Le montant doit être positif' },
                                            valueAsNumber: true
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder='Montant'
                                        className={`w-full px-5 py-3 bg-white border-2 rounded-xl 
                                            focus:outline-none focus:border-blue-500
                                            transition-all duration-300 ${errors.phasesBudget ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.phasesBudget && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phasesBudget.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Matériels */}
                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-2 w-32 font-bold text-gray-700">
                                    Matériels
                                </label>
                                <div className='flex-1'>
                                    <input
                                        {...register('materielsBudget', {
                                            required: 'Le budget pour les matériels est requis',
                                            min: { value: 0, message: 'Le montant doit être positif' },
                                            valueAsNumber: true
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder='Montant'
                                        className={`w-full px-5 py-3 bg-white border-2 rounded-xl 
                                            focus:outline-none focus:border-blue-500
                                            transition-all duration-300 ${errors.materielsBudget ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.materielsBudget && (
                                        <p className="text-red-500 text-sm mt-1">{errors.materielsBudget.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Campagnes */}
                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-2 w-32 font-bold text-gray-700">
                                    Campagnes
                                </label>
                                <div className='flex-1'>
                                    <input
                                        {...register('campagnesBudget', {
                                            required: 'Le budget pour les campagnes est requis',
                                            min: { value: 0, message: 'Le montant doit être positif' },
                                            valueAsNumber: true
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder='Montant'
                                        className={`w-full px-5 py-3 bg-white border-2 rounded-xl 
                                            focus:outline-none focus:border-blue-500
                                            transition-all duration-300 ${errors.campagnesBudget ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.campagnesBudget && (
                                        <p className="text-red-500 text-sm mt-1">{errors.campagnesBudget.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Réserve (%) */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <label className="inline-flex items-center gap-2 w-32 font-bold text-gray-700">
                                    Réserve (%)
                                </label>
                                <div className='flex-1'>
                                    <input
                                        {...register('reserve', {
                                            required: 'Le pourcentage de réserve est requis',
                                            min: { value: 0, message: 'La réserve doit être au moins 0%' },
                                            max: { value: 100, message: 'La réserve ne peut pas dépasser 100%' },
                                            valueAsNumber: true
                                        })}
                                        type="number"
                                        step="1"
                                        min="0"
                                        max="100"
                                        placeholder='Pourcentage'
                                        className={`w-full px-5 py-3 bg-white border-2 rounded-xl 
                                            focus:outline-none focus:border-blue-500
                                            transition-all duration-300 ${errors.reserve ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.reserve && (
                                        <p className="text-red-500 text-sm mt-1">{errors.reserve.message}</p>
                                    )}
                                    {watchReserve > 0 && watchMontantTotal > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Montant réservé : {(((watchMontantTotal || 0) * (watchReserve || 0)) / 100).toLocaleString()} {watchDevise}
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Barre de progression */}
                        {montantApresReserve > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>0</span>
                                    <span>{Math.min(100, Math.round((totalBudgets / montantApresReserve) * 100))}% utilisé</span>
                                    <span>{montantApresReserve.toLocaleString()} {watchDevise}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full transition-all duration-300 ${totalBudgets > montantApresReserve
                                            ? 'bg-red-600'
                                            : totalBudgets > montantApresReserve * 0.9
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                            }`}
                                        style={{
                                            width: `${Math.min(100, (totalBudgets / montantApresReserve) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>