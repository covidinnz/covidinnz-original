export function resolveValue(constants, value) {
    value = value.replace(/\*/g, '');
    return constants.find((c) =>
        [c.name, c.id, ...(c.alts ?? [])]
            .map((a) => a.toString().toLowerCase())
            .includes(value.toString().toLowerCase()),
    );
}

export const CountTypes = [
    { id: -1, name: 'Total' },
    { id: 1, name: 'Confirmed' },
    { id: 2, name: 'Probable' },
];

export const ActiveSources = [
    {
        id: 1,
        name: 'Managed Facilities',
        alts: ['PPeople who travelled internationally and were diagnosed in managed facilities at the border '],
    },
    {
        id: 2,
        name: 'Contact Overseas',
        alts: ['People in close contact with someone who caught COVID-19 while overseas'],
    },
    { id: 3, name: 'Contact Locally', alts: ['Caught COVID-19 from someone locally'] },
    { id: 4, name: 'Locally Unknown', alts: ['Caught COVID-19 within NZ, but source is unknown'] },
    { id: 5, name: 'Under Investigation', alts: ['Under investigation'] },
];

export const Boards = [
    { id: -1, name: 'Total', alts: ['New Zealand', 'Total'] },
    {
        id: 0,
        name: 'Other / Unknown',
        alts: ['Overseas / Unknown', 'Overseas', 'Unknown', 'Managed Isolation', 'Managed', 'Quarantine'],
    },
    { id: 1, name: 'Auckland' },
    { id: 2, name: 'Bay of Plenty' },
    { id: 3, name: 'Canterbury' },
    { id: 4, name: 'Capital and Coast' },
    { id: 5, name: 'Counties Manukau' },
    { id: 6, name: "Hawke's Bay", alts: ['Hawkes Bay'] },
    { id: 7, name: 'Hutt Valley' },
    { id: 8, name: 'Lakes' },
    { id: 9, name: 'Mid Central', alts: ['MidCentral'] },
    { id: 10, name: 'Nelson Marlborough' },
    { id: 11, name: 'Northland' },
    { id: 12, name: 'South Canterbury' },
    { id: 13, name: 'Southern' },
    { id: 14, name: 'Tairāwhiti', alts: ['Tairawhiti'] },
    { id: 15, name: 'Taranaki' },
    { id: 16, name: 'Waikato' },
    { id: 17, name: 'Wairarapa' },
    { id: 18, name: 'Waitematā', alts: ['Waitemata'] },
    { id: 19, name: 'West Coast' },
    { id: 20, name: 'Whanganui' },
    { id: 21, name: 'At the border' },

    { id: 22, name: 'Canterbury/West Coast' },
    { id: 23, name: 'Capital & Coast/Hutt' },
];

export const Ethnicities = [
    { id: -1, name: 'Total' },
    { id: 0, name: 'Unknown' },
    { id: 1, name: 'Māori', alts: ['Maori'] },
    {
        id: 2,
        name: 'European, Other',
        alts: ['European or Other', 'European/Other', 'European / Other'],
    },
    { id: 3, name: 'Pacific people', alts: ['Pacific peoples', 'Pacific'] },
    { id: 4, name: 'Asian', alts: ['Asian'] },
    {
        id: 5,
        name: 'Middle Eastern, Latin American, African',
        alts: ['Middle Eastern, Latin American and African (MELAA)', 'Middle Eastern/Latin American/African'],
    },
];

export const AgeGroups = [
    { id: -1, name: 'Total' },
    { id: 0, name: 'Unknown' },
    { id: 1, name: '0 to 9', alts: ['0-9'] },
    { id: 2, name: '10 to 19', alts: ['10-19'] },
    { id: 3, name: '20 to 29', alts: ['20-29'] },
    { id: 4, name: '30 to 39', alts: ['30-39'] },
    { id: 5, name: '40 to 49', alts: ['40-49'] },
    { id: 6, name: '50 to 59', alts: ['50-59'] },
    { id: 7, name: '60 to 69', alts: ['60-69'] },
    { id: 8, name: '70 to 79', alts: ['70-79'] },
    { id: 9, name: '80 to 89', alts: ['80-89'] },
    { id: 10, name: '90+', alts: ['90+'] },
];

export const Genders = [
    { id: -1, name: 'Total' },
    { id: 0, name: 'Unknown' },
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
];

export const Months = [
    { id: 1, js: 0, name: 'January', alts: ['Jan'] },
    { id: 2, js: 1, name: 'February', alts: ['Feb'] },
    { id: 3, js: 2, name: 'March', alts: ['Mar'] },
    { id: 4, js: 3, name: 'April', alts: ['Apr'] },
    { id: 5, js: 4, name: 'May' },
    { id: 6, js: 5, name: 'June', alts: ['Jun'] },
    { id: 7, js: 6, name: 'July', alts: ['Jul'] },
    { id: 8, js: 7, name: 'August', alts: ['Aug'] },
    { id: 9, js: 8, name: 'September', alts: ['Sep'] },
    { id: 10, js: 9, name: 'October', alts: ['Oct'] },
    { id: 11, js: 10, name: 'November', alts: ['Nov'] },
    { id: 12, js: 11, name: 'December', alts: ['Dec'] },
];
