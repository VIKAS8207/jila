export const ROLES = {
  CO_JILA_ADHYAKSH: 'CO Jila Adhyaksh',
  JANPAD: 'Janpad',
  GRAM_PANCHAYAT: 'Gram Panchayat',
  ENGINEER: 'Engineer',
  SUB_ENGINEER: 'Sub-Engineer',
  ACCOUNTANT: 'Accountant'
};

export const ROLE_ACCESS = {
  [ROLES.CO_JILA_ADHYAKSH]: 'FULL',
  [ROLES.JANPAD]: 'FULL',
  [ROLES.GRAM_PANCHAYAT]: 'FULL',
  [ROLES.ENGINEER]: 'LIMITED',
  [ROLES.SUB_ENGINEER]: 'LIMITED',
  [ROLES.ACCOUNTANT]: 'FINANCE'
};