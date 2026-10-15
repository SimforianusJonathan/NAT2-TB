// Single citation registry. Literature supports associations, never this scoring system.
export interface Evidence {
  id: string;
  title: string;
  source: string;
  year: string;
  type: string;
  geography: string;
  strength: string;
  applicability: string;
  summary: string;
  limitation: string;
  url: string | null;
  status: "verified" | "prototype" | "placeholder";
}

export const evidence: Evidence[] = [
  {
    id: "E01",
    title: "NAT2 and isoniazid clearance",
    source:
      "Influence of NAT2 genotype/SNPs on clearance of isoniazid: a systematic review of population pharmacokinetic models",
    year: "2022",
    type: "Systematic review of PK models",
    geography: "Global",
    strength: "Established association",
    applicability: "Indirect; individual exposure unvalidated",
    summary:
      "NAT2 variation helps explain differences in isoniazid clearance across studied populations.",
    limitation:
      "Study models differ. No model, effect size or exposure equation is transferred into this prototype.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9482569/",
    status: "verified",
  },
  {
    id: "E02",
    title: "Indonesian isoniazid population PK",
    source:
      "Development of population pharmacokinetics model of isoniazid in Indonesian patients with tuberculosis",
    year: "2022",
    type: "Population pharmacokinetic study",
    geography: "Indonesia",
    strength: "Population-specific evidence",
    applicability: "Relevant context; external validation needed",
    summary:
      "An Indonesian population PK study considers body weight and NAT2 acetylator phenotype as covariates.",
    limitation:
      "The published model is not implemented. Indonesian origin alone does not validate individual predictions or the demo rules.",
    url: "https://www.ijidonline.com/article/S1201971222000042/fulltext",
    status: "verified",
  },
  {
    id: "E03",
    title: "NAT2 and liver injury in Bandung",
    source:
      "NAT2 Gene rs1041983 is Associated with Anti-Tuberculosis Drug Induced Hepatotoxicity Among Pediatric Tuberculosis in Bandung, Indonesia",
    year: "2021",
    type: "Pediatric association study",
    geography: "Indonesia · Bandung",
    strength: "Limited population-specific association",
    applicability: "Limited for these synthetic adult cases",
    summary:
      "This Indonesian pediatric study examines an association between NAT2 variation and anti-TB drug hepatotoxicity.",
    limitation:
      "Pediatric evidence and a specific variant association must not be treated as a validated adult phenotype-based monitoring rule.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8184287/",
    status: "verified",
  },
  {
    id: "E04",
    title: "High-dose INH pharmacokinetics in Indonesia",
    source:
      "Pharmacokinetics and pharmacodynamics of high-dose isoniazid for the treatment of rifampicin- or multidrug-resistant tuberculosis in Indonesia",
    year: "2024",
    type: "Observational PK / exploratory PD study",
    geography: "Indonesia",
    strength: "Population-specific evidence",
    applicability: "Limited: high-dose RR/MDR-TB context",
    summary:
      "An Indonesian study examines isoniazid exposure in adults receiving high-dose regimens for RR/MDR-TB.",
    limitation:
      "Dose, resistance setting and phenotypic acetylator classification differ from the demo. This is contextual evidence only.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11062943/",
    status: "verified",
  },
  {
    id: "P01",
    title: "Prototype monitoring rules",
    source: "NAT2-TB demonstration rule specification v1",
    year: "2026",
    type: "Unvalidated design choice",
    geography: "No validated population",
    strength: "Not clinically validated",
    applicability: "Demonstration only",
    summary:
      "Point weights, score bands, lab-change thresholds and monitoring prompts are authored to demonstrate the concept.",
    limitation:
      "No sensitivity, specificity, AUROC, probability, personalized dose or clinical performance is claimed. A clinician must independently assess symptoms and laboratory results.",
    url: null,
    status: "prototype",
  },
  {
    id: "P02",
    title: "Local monitoring protocol",
    source:
      "Citation placeholder — clinician-approved Indonesian monitoring protocol",
    year: "Pending",
    type: "Reference to be supplied",
    geography: "Indonesia",
    strength: "Not assessed",
    applicability: "Not used by the rule engine",
    summary:
      "A clinical partner should select and verify an applicable local protocol before any technical or clinical validation.",
    limitation:
      "This is an explicit placeholder, not a citation or a source of clinical recommendations.",
    url: null,
    status: "placeholder",
  },
];
