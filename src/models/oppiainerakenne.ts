export interface Oppiainerakenne {
    perusteId: number;
    oppiaineet: Oppiaine[];
}

export interface Oppiaine {
    id: number;
    parentId: number | null;
    tunniste: string;
    jarjestys: number;
    koodiArvo: string;
    koodiUri: string;
    nimi: LocalizedStringObject;
    koosteinen: boolean;
    abstrakti: boolean;
    pakollinenKurssiKuvaus: LocalizedStringObject | null;
    syventavaKurssiKuvaus: LocalizedStringObject | null;
    soveltavaKurssiKuvaus: LocalizedStringObject | null;
    tavoitteet: {
        otsikko: LocalizedStringObject | null;
        teksti: LocalizedStringObject | null;
    } | null;
    arviointi: {
        otsikko: LocalizedStringObject | null;
        teksti: LocalizedStringObject | null;
    } | null;
    tehtava: {
        otsikko: LocalizedStringObject | null;
        teksti: LocalizedStringObject | null;
    } | null;
    oppimaarat: Oppiaine[];
    kurssit: Kurssi[];
}

export interface LocalizedStringObject {
    fi?: string;
    sv?: string;
    _id: string;
}

export interface Kurssi {
    id: number;
    oppiaineId: number;
    jarjestys: number;
    tunniste: string;
    koodiUri: string;
    koodiArvo: string;
    lokalisoituKoodi: LocalizedStringObject;
    tyyppi: string;
    nimi: LocalizedStringObject;
    kuvaus: LocalizedStringObject;
    tavoitteet: {
        otsikko: LocalizedStringObject | null;
        teksti: LocalizedStringObject | null;
    } | null;
    keskeisetSisallot: {
        otsikko: LocalizedStringObject | null;
        teksti: LocalizedStringObject | null;
    } | null;
    tavoitteetJaKeskeisetSisallot: {
        otsikko: LocalizedStringObject | null;
        teksti: LocalizedStringObject | null;
    } | null;
}
