
export const formateDateChamps = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
};

export const  formateDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}


export const mettreEnMajuscule = (texte)=> {
    // Vérifier si le paramètre est une chaîne de caractères
    if (typeof texte !== 'string') {
        return "Erreur : Le paramètre doit être une chaîne de caractères";
    }
    return texte.toUpperCase();
}

export const verifieChamps = (errors = {}, watchedFields = {}, champs) => {
    // Vérification que champs est fourni
    if (!champs) {
        console.warn('verifieChamps: Le paramètre "champs" est requis');
        return 'border-gray-200 focus:border-blue-500';
    }

    // Priorité : erreur > champ rempli > défaut
    if (errors[champs]) {
        return 'border-red-500 focus:border-red-500';
    }
    
    if (watchedFields[champs] && watchedFields[champs].length > 0) {
        return 'border-green-500 focus:border-green-500';
    }
    
    return 'border-gray-200 focus:border-blue-500';
}

export const styleChamps = () => {
    const style = `w-full px-5 py-3 bg-gray-50 border-2 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`
    return style ;
    
}


export const limiteTexte = (texte, limite = 250) => {
    if (!texte) return '';
    
    if (texte.length <= limite) return texte;
    
    // Coupe à la limite et trouve le dernier espace
    const subString = texte.substr(0, limite);
    const lastSpace = subString.lastIndexOf(' ');
    
    // Si on trouve un espace, on coupe à cet endroit
    if (lastSpace > 0) {
        return subString.substr(0, lastSpace) + '...';
    }
    
    // Sinon, on coupe à la limite
    return subString + '...';
};

export const formatMontant = (value) => {
  const val = Number(value) || 0;

  if (val >= 1e12) {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val / 1e12) + " T"; // trillion
  }

  if (val >= 1e9) {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val / 1e9) + " Md"; // milliard
  }

  if (val >= 1e6) {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val / 1e6) + " M"; // million
  }

  if (val >= 1e3) {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val / 1e3) + " K"; // mille
  }

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};


export const formateMontantSimple = (montnant) => {
  const val = Number(montnant) || 0;
   return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
  
  
}

export const getDeviseSymbol = (code , devises) => {
    return devises.find(d => d.code === code)?.symbole || code;
}
   
export const getDeviseNom = (code , devises) => {
    return devises.find(d => d.code === code)?.nom || code;
    
}

// 1. Fonction pour récupérer uniquement les codes
export const getCodesDevises = (devises)=> {
  return devises.map(devise => devise.code);
}

// 2. Fonction pour récupérer uniquement les noms

export const getNomsDevises = (devises)=> {
  return devises.map(devise => devise.nom);
}

// 3. Fonction pour récupérer uniquement les symboles

export const getSymbolesDevises = (devises)=> {
  return devises.map(devise => devise.symbole);
}
    
    
