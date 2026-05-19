// topicMap.js
// Maps topic IDs to keyword patterns found in question text.
// The scorer uses this to automatically tag each question answered.

export const TOPICS = {
  AUM: [
    {
      id: 'aum_pharmacokinetics',
      name: 'Pharmacokinetics (ADME)',
      course: 'AUM',
      weight: 10,
      examQuestions: 68,
      keywords: [
        'absorption', 'distribution', 'metabolism', 'excretion',
        'bioavailability', 'half-life', 'first-pass', 'pharmacokinetic',
        'adme', 'clearance', 'steady state', 'volume of distribution',
        'plasma concentration', 'renal excretion', 'hepatic'
      ]
    },
    {
      id: 'aum_antimicrobials',
      name: 'Antimicrobials & antibiotics',
      course: 'AUM',
      weight: 9,
      examQuestions: 62,
      keywords: [
        'antibiotic', 'penicillin', 'amoxicillin', 'cephalosporin',
        'macrolide', 'erythromycin', 'azithromycin', 'tetracycline',
        'aminoglycoside', 'gentamicin', 'ciprofloxacin', 'fluoroquinolone',
        'bactericidal', 'bacteriostatic', 'cell wall', 'ribosomal',
        'beta-lactam', 'mic', 'minimum inhibitory', 'mrsa', 'vancomycin',
        'metronidazole', 'clindamycin', 'cotrimoxazole', 'trimethoprim'
      ]
    },
    {
      id: 'aum_cardiovascular',
      name: 'Cardiovascular drugs',
      course: 'AUM',
      weight: 9,
      examQuestions: 58,
      keywords: [
        'hypertension', 'antihypertensive', 'ace inhibitor', 'lisinopril',
        'enalapril', 'captopril', 'beta-blocker', 'atenolol', 'propranolol',
        'calcium channel', 'amlodipine', 'nifedipine', 'verapamil',
        'diuretic', 'furosemide', 'spironolactone', 'hydrochlorothiazide',
        'digoxin', 'heart failure', 'angina', 'nitroglycerin', 'nitrate',
        'losartan', 'arb', 'statin', 'atorvastatin', 'inotropic',
        'antiarrhythmic', 'warfarin', 'heparin', 'anticoagulant'
      ]
    },
    {
      id: 'aum_analgesics',
      name: 'Analgesics & NSAIDs',
      course: 'AUM',
      weight: 8,
      examQuestions: 55,
      keywords: [
        'analgesic', 'nsaid', 'paracetamol', 'aspirin', 'ibuprofen',
        'diclofenac', 'morphine', 'opioid', 'codeine', 'tramadol',
        'cyclooxygenase', 'cox', 'prostaglandin', 'pain', 'antipyretic',
        'anti-inflammatory', 'naloxone', 'acetylcysteine', 'overdose',
        'salicylate', 'mefenamic', 'indomethacin'
      ]
    },
    {
      id: 'aum_antimalarials',
      name: 'Antimalarials',
      course: 'AUM',
      weight: 8,
      examQuestions: 52,
      keywords: [
        'malaria', 'chloroquine', 'artemether', 'lumefantrine', 'act',
        'artesunate', 'quinine', 'primaquine', 'plasmodium', 'fansidar',
        'sulfadoxine', 'pyrimethamine', 'prophylaxis', 'antimalarial',
        'schizonticide', 'gametocytocide', 'mefloquine', 'lonart'
      ]
    },
    {
      id: 'aum_drug_sources',
      name: 'Drug sources & classification',
      course: 'AUM',
      weight: 7,
      examQuestions: 48,
      keywords: [
        'plant source', 'animal source', 'mineral source', 'synthetic',
        'semi-synthetic', 'generic name', 'brand name', 'trade name',
        'chemical name', 'otc', 'over-the-counter', 'pom', 'prescription only',
        'pharmacology', 'pharmacognosy', 'drug classification', 'nonproprietary'
      ]
    },
    {
      id: 'aum_gi_drugs',
      name: 'GI tract drugs',
      course: 'AUM',
      weight: 7,
      examQuestions: 45,
      keywords: [
        'antacid', 'omeprazole', 'proton pump', 'ppi', 'ranitidine',
        'h2 blocker', 'h2 receptor', 'peptic ulcer', 'helicobacter',
        'laxative', 'bisacodyl', 'senna', 'lactulose', 'loperamide',
        'antiemetic', 'metoclopramide', 'ondansetron', 'misoprostol',
        'sucralfate', 'diarrhoea', 'constipation', 'vomiting'
      ]
    },
    {
      id: 'aum_diabetes',
      name: 'Diabetes management',
      course: 'AUM',
      weight: 7,
      examQuestions: 42,
      keywords: [
        'diabetes', 'insulin', 'metformin', 'glibenclamide', 'sulphonylurea',
        'hypoglycaemia', 'hyperglycaemia', 'type 1', 'type 2',
        'acarbose', 'glucagon', 'biguanide', 'glucose', 'glycogen',
        'antidiabetic', 'glipizide', 'rosiglitazone', 'pioglitazone'
      ]
    },
    {
      id: 'aum_antifungal_antiviral',
      name: 'Antifungals & antivirals',
      course: 'AUM',
      weight: 6,
      examQuestions: 38,
      keywords: [
        'antifungal', 'fluconazole', 'ketoconazole', 'itraconazole',
        'nystatin', 'amphotericin', 'azole', 'candida', 'fungal',
        'antiviral', 'acyclovir', 'oseltamivir', 'herpes', 'influenza',
        'tamiflu', 'ganciclovir', 'ribavirin', 'polyene', 'echinocandin'
      ]
    },
    {
      id: 'aum_respiratory',
      name: 'Respiratory drugs',
      course: 'AUM',
      weight: 6,
      examQuestions: 36,
      keywords: [
        'asthma', 'salbutamol', 'bronchodilator', 'theophylline',
        'aminophylline', 'beclomethasone', 'inhaled corticosteroid',
        'ipratropium', 'montelukast', 'leukotriene', 'copd', 'salmeterol',
        'beta-2 agonist', 'bronchospasm', 'respiratory', 'inhaler'
      ]
    },
    {
      id: 'aum_hiv',
      name: 'HIV/AIDS antiretrovirals',
      course: 'AUM',
      weight: 5,
      examQuestions: 34,
      keywords: [
        'hiv', 'aids', 'antiretroviral', 'art', 'haart', 'nrti',
        'nnrti', 'zidovudine', 'nevirapine', 'efavirenz', 'lamivudine',
        'tenofovir', 'protease inhibitor', 'lopinavir', 'cd4'
      ]
    },
    {
      id: 'aum_cns',
      name: 'CNS drugs',
      course: 'AUM',
      weight: 5,
      examQuestions: 32,
      keywords: [
        'epilepsy', 'phenytoin', 'carbamazepine', 'phenobarbitone',
        'parkinson', 'levodopa', 'benzodiazepine', 'diazepam',
        'antidepressant', 'ssri', 'fluoxetine', 'antipsychotic',
        'chlorpromazine', 'haloperidol', 'lithium', 'bipolar',
        'anxiety', 'sedative', 'hypnotic', 'barbiturate'
      ]
    },
    {
      id: 'aum_vitamins',
      name: 'Vitamins & deficiencies',
      course: 'AUM',
      weight: 5,
      examQuestions: 30,
      keywords: [
        'vitamin', 'vitamin a', 'vitamin b', 'vitamin c', 'vitamin d',
        'vitamin k', 'folic acid', 'b12', 'riboflavin', 'thiamine',
        'pyridoxine', 'anaemia', 'scurvy', 'rickets', 'night blindness',
        'fat-soluble', 'water-soluble', 'megaloblastic', 'deficiency'
      ]
    },
    {
      id: 'aum_endocrine',
      name: 'Endocrine system drugs',
      course: 'AUM',
      weight: 4,
      examQuestions: 28,
      keywords: [
        'thyroid', 'thyroxine', 'carbimazole', 'methimazole',
        'corticosteroid', 'prednisolone', 'hydrocortisone', 'dexamethasone',
        'contraceptive', 'oral contraceptive', 'oestrogen', 'progesterone',
        'oxytocin', 'clomiphene', 'hormone', 'cushing', 'addison'
      ]
    },
    {
      id: 'aum_anticancer',
      name: 'Anticancer drugs',
      course: 'AUM',
      weight: 4,
      examQuestions: 24,
      keywords: [
        'cancer', 'anticancer', 'chemotherapy', 'alkylating',
        'cyclophosphamide', 'methotrexate', 'antimetabolite',
        'vincristine', 'tamoxifen', 'cisplatin', 'doxorubicin',
        'tumour', 'malignant', 'cytotoxic', 'oncology'
      ]
    },
  ],

  BDT: [
    {
      id: 'bdt_emulsions',
      name: 'Emulsions',
      course: 'BDT',
      weight: 10,
      examQuestions: 52,
      keywords: [
        'emulsion', 'emulsify', 'emulgent', 'o/w', 'w/o',
        'primary emulsion', 'creaming', 'cracking', 'phase inversion',
        'acacia', 'tragacanth', 'dry gum', 'wet gum', 'continental',
        'emulsifying agent', 'surfactant', 'coalescence', '4:2:1'
      ]
    },
    {
      id: 'bdt_calculations',
      name: 'Pharmaceutical calculations',
      course: 'BDT',
      weight: 10,
      examQuestions: 48,
      keywords: [
        'calculate', 'percentage', 'w/v', 'v/v', 'w/w',
        'ratio strength', 'dilution', 'concentration', 'dose volume',
        'flow rate', 'ml', 'gram', 'mg', 'infusion rate', 'specific gravity',
        'density', 'how many', 'what volume', 'what weight'
      ]
    },
    {
      id: 'bdt_suspensions',
      name: 'Suspensions',
      course: 'BDT',
      weight: 9,
      examQuestions: 44,
      keywords: [
        'suspension', 'sedimentation', 'caking', 'flocculation',
        'deflocculation', 'suspending agent', 'calamine', 'diffusible',
        'indiffusible', 'shake well', 'settling', 'kaolin', 'bentonite',
        'methylcellulose', 'magnesium trisilicate'
      ]
    },
    {
      id: 'bdt_tablets_capsules',
      name: 'Tablets & capsules',
      course: 'BDT',
      weight: 9,
      examQuestions: 42,
      keywords: [
        'tablet', 'capsule', 'disintegrant', 'binder', 'lubricant',
        'glidant', 'diluent', 'granulation', 'wet granulation', 'dry granulation',
        'compression', 'enteric coated', 'film coated', 'sugar coated',
        'hard gelatin', 'soft gelatin', 'effervescent', 'sustained release',
        'lactose', 'starch', 'magnesium stearate', 'talc'
      ]
    },
    {
      id: 'bdt_prescription',
      name: 'Prescription interpretation',
      course: 'BDT',
      weight: 8,
      examQuestions: 40,
      keywords: [
        'prescription', 'superscription', 'inscription', 'subscription',
        'tds', 'bd', 'od', 'qid', 'prn', 'stat', 'nocte', 'mane',
        'ac', 'pc', 'po', 'fiat', 'mitte', 'rx', 'latin', 'abbreviation',
        'dispensing', 'valid prescription', 'prescriber'
      ]
    },
    {
      id: 'bdt_semi_solid',
      name: 'Semi-solid preparations',
      course: 'BDT',
      weight: 7,
      examQuestions: 38,
      keywords: [
        'ointment', 'cream', 'paste', 'gel', 'semi-solid',
        'hydrocarbon base', 'absorption base', 'water-miscible',
        'petrolatum', 'lanolin', 'polyethylene glycol', 'carbopol',
        'levigation', 'trituration tile', 'topical', 'emollient'
      ]
    },
    {
      id: 'bdt_packaging',
      name: 'Drug packaging & containers',
      course: 'BDT',
      weight: 6,
      examQuestions: 35,
      keywords: [
        'container', 'packaging', 'glass', 'plastic', 'amber bottle',
        'fluted', 'primary package', 'secondary package', 'blister',
        'ampoule', 'vial', 'closure', 'child resistant', 'label',
        'auxiliary label', 'sorption', 'leaching'
      ]
    },
    {
      id: 'bdt_storage',
      name: 'Drug storage & stability',
      course: 'BDT',
      weight: 6,
      examQuestions: 34,
      keywords: [
        'storage', 'stability', 'expiry', 'cold chain', 'refrigerator',
        'thermolabile', 'fefo', 'fifo', 'temperature', 'light sensitive',
        'shelf life', 'deterioration', 'pallet', 'drug store', 'stock rotation'
      ]
    },
    {
      id: 'bdt_suppositories',
      name: 'Suppositories & pessaries',
      course: 'BDT',
      weight: 5,
      examQuestions: 30,
      keywords: [
        'suppository', 'pessary', 'rectal', 'vaginal', 'theobroma',
        'cocoa butter', 'mould', 'displacement factor', 'glycerol gelatin',
        'urethral bougie', 'base', 'first-pass bypass'
      ]
    },
    {
      id: 'bdt_oral_liquids',
      name: 'Oral liquid preparations',
      course: 'BDT',
      weight: 5,
      examQuestions: 28,
      keywords: [
        'mixture', 'syrup', 'elixir', 'linctus', 'solution',
        'oral liquid', 'simple syrup', 'aromatic water', 'vehicle',
        'preservative', 'chloroform water', 'sucrose', 'reconstitution'
      ]
    },
    {
      id: 'bdt_powders',
      name: 'Powders & granules',
      course: 'BDT',
      weight: 4,
      examQuestions: 26,
      keywords: [
        'powder', 'granule', 'sieve', 'trituration', 'geometric dilution',
        'levigation', 'size reduction', 'comminution', 'mortar pestle',
        'dusting powder', 'insufflation', 'bulk powder', 'divided powder'
      ]
    },
    {
      id: 'bdt_drf',
      name: 'Drug Revolving Fund',
      course: 'BDT',
      weight: 4,
      examQuestions: 24,
      keywords: [
        'drug revolving', 'drf', 'seed stock', 'seed capital',
        'revolving fund', 'drug fund', 'community participation',
        'stock record', 'bin card', 'ledger', 'requisition', 'issue voucher'
      ]
    },
  ],

  PPTP: [
    {
      id: 'pptp_pcn',
      name: 'PCN & pharmacy regulation',
      course: 'PPTP',
      weight: 10,
      examQuestions: 72,
      keywords: [
        'pcn', 'pharmacists council', 'registrar', 'annual permit',
        'npce', 'pharmacy regulation', 'pharmacy premises', 'licensing',
        'induction', 'pharmacy technician registration', 'governing council',
        'college of health technology', 'ppa', 'poisons and pharmacy'
      ]
    },
    {
      id: 'pptp_nafdac',
      name: 'NAFDAC',
      course: 'PPTP',
      weight: 9,
      examQuestions: 60,
      keywords: [
        'nafdac', 'national agency for food', 'drug registration',
        'director general', 'dg nafdac', 'nafdac number', 'drug importation',
        'food drug', 'regulatory agency', 'governing council nafdac',
        'niprd', 'safeguard public health'
      ]
    },
    {
      id: 'pptp_controlled_drugs',
      name: 'Controlled & dangerous drugs',
      course: 'PPTP',
      weight: 9,
      examQuestions: 55,
      keywords: [
        'controlled drug', 'dangerous drug', 'dda', 'narcotic',
        'schedule', 'poison cupboard', 'poison disposal register',
        'morphine', 'codeine controlled', 'diazepam controlled',
        'tramadol controlled', 'coca leaves', 'raw opium', 'indian hemp',
        'cannabis', 'schedule poison', 'form k'
      ]
    },
    {
      id: 'pptp_pt_roles',
      name: 'Pharmacy technician roles & ethics',
      course: 'PPTP',
      weight: 8,
      examQuestions: 52,
      keywords: [
        'pharmacy technician', 'pt role', 'pt duties', 'scope of practice',
        'code of ethics', 'professional conduct', 'pt cannot', 'pt must not',
        'under supervision', 'supportive role', 'pharmacist supervision',
        'counselling patient', 'dispensing under', 'annual permit pt'
      ]
    },
    {
      id: 'pptp_ndp',
      name: 'National Drug Policy & EDL',
      course: 'PPTP',
      weight: 7,
      examQuestions: 44,
      keywords: [
        'national drug policy', 'ndp', 'essential drug', 'edl',
        'essential medicines', 'rational drug use', 'inn',
        'international nonproprietary', 'who essential', 'pharmacovigilance',
        'adverse drug reaction reporting', 'drug policy objective'
      ]
    },
    {
      id: 'pptp_ndlea',
      name: 'NDLEA',
      course: 'PPTP',
      weight: 7,
      examQuestions: 40,
      keywords: [
        'ndlea', 'drug law enforcement', 'drug trafficking',
        'hard drugs', 'drug abuse enforcement', 'cannabis seizure',
        'ndlea functions', 'illegal drug', 'illicit drug'
      ]
    },
    {
      id: 'pptp_distribution',
      name: 'Drug distribution guidelines',
      course: 'PPTP',
      weight: 6,
      examQuestions: 38,
      keywords: [
        'drug distribution', 'mega drug', 'state drug distribution',
        'ppmv', 'patent medicine vendor', 'ppmvl', 'distribution channel',
        'wholesale', 'retail pharmacy', 'community pharmacy definition',
        'organogram', 'drug distribution centre'
      ]
    },
    {
      id: 'pptp_nhis',
      name: 'NHIS',
      course: 'PPTP',
      weight: 5,
      examQuestions: 32,
      keywords: [
        'nhis', 'national health insurance', 'enrollee', 'co-payment',
        'health insurance', 'formal sector', 'urban self-employed',
        'rural community', 'health insurance scheme'
      ]
    },
    {
      id: 'pptp_hospitals',
      name: 'Hospital types & management',
      course: 'PPTP',
      weight: 4,
      examQuestions: 28,
      keywords: [
        'hospital classification', 'general hospital', 'specialist hospital',
        'teaching hospital', 'primary health care', 'secondary', 'tertiary',
        'hospital management board', 'hmb', 'federal medical centre',
        'private hospital', 'mission hospital'
      ]
    },
    {
      id: 'pptp_son_cpc',
      name: 'SON & CPC',
      course: 'PPTP',
      weight: 4,
      examQuestions: 25,
      keywords: [
        'son', 'standard organisation', 'standard council',
        'cpc', 'consumer protection', 'quality standard',
        'product standard', 'consumer protection council'
      ]
    },
  ],

  ANA: [
    {
      id: 'ana_cardiovascular',
      name: 'Cardiovascular system',
      course: 'ANA',
      weight: 10,
      examQuestions: 48,
      keywords: [
        'heart', 'cardiac', 'atrium', 'ventricle', 'valve',
        'tricuspid', 'mitral', 'aorta', 'blood pressure', 'pulse',
        'coronary', 'myocardium', 'endocardium', 'pericardium',
        'sinoatrial', 'sa node', 'systole', 'diastole', 'artery', 'vein'
      ]
    },
    {
      id: 'ana_blood',
      name: 'Blood & haematology',
      course: 'ANA',
      weight: 9,
      examQuestions: 42,
      keywords: [
        'blood', 'erythrocyte', 'rbc', 'leucocyte', 'wbc', 'platelet',
        'thrombocyte', 'plasma', 'haemoglobin', 'blood group', 'abo',
        'anaemia', 'hematopoiesis', 'bone marrow', 'fibrinogen',
        'albumin', 'globulin', 'phagocytosis', 'lymphocyte'
      ]
    },
    {
      id: 'ana_reproductive',
      name: 'Reproductive system',
      course: 'ANA',
      weight: 8,
      examQuestions: 38,
      keywords: [
        'ovary', 'uterus', 'vagina', 'cervix', 'fallopian', 'oviduct',
        'testis', 'epididymis', 'vas deferens', 'prostate', 'scrotum',
        'menstrual cycle', 'ovulation', 'menopause', 'fertilisation',
        'spermatozoa', 'ova', 'reproductive', 'hymen', 'labia'
      ]
    },
    {
      id: 'ana_urinary',
      name: 'Urinary system',
      course: 'ANA',
      weight: 8,
      examQuestions: 35,
      keywords: [
        'kidney', 'nephron', 'glomerulus', 'renal', 'ureter',
        'urethra', 'bladder', 'filtration', 'tubular reabsorption',
        'tubular secretion', 'loop of henle', 'bowman capsule',
        'urine formation', 'erythropoietin', 'renal pelvis'
      ]
    },
    {
      id: 'ana_endocrine',
      name: 'Endocrine system',
      course: 'ANA',
      weight: 7,
      examQuestions: 32,
      keywords: [
        'pituitary', 'hypothalamus', 'thyroid', 'adrenal', 'pancreas',
        'insulin', 'glucagon', 'cortisol', 'adrenaline', 'fsh', 'lh',
        'prolactin', 'oxytocin', 'antidiuretic', 'adh', 'endocrine',
        'hormone', 'beta cell', 'alpha cell', 'aldosterone'
      ]
    },
    {
      id: 'ana_nervous',
      name: 'Nervous system',
      course: 'ANA',
      weight: 7,
      examQuestions: 30,
      keywords: [
        'neuron', 'brain', 'spinal cord', 'cerebrum', 'cerebellum',
        'medulla oblongata', 'thalamus', 'hypothalamus', 'nerve',
        'axon', 'dendrite', 'synapse', 'neurotransmitter', 'myelin',
        'cns', 'pns', 'somatic', 'autonomic', 'reflex', 'meninges'
      ]
    },
    {
      id: 'ana_respiratory',
      name: 'Respiratory system',
      course: 'ANA',
      weight: 6,
      examQuestions: 28,
      keywords: [
        'lung', 'alveoli', 'trachea', 'bronchi', 'bronchiole',
        'larynx', 'pharynx', 'epiglottis', 'inspiration', 'expiration',
        'respiration', 'diaphragm', 'surfactant', 'gas exchange',
        'tidal volume', 'vital capacity', 'pleura'
      ]
    },
    {
      id: 'ana_digestive',
      name: 'Digestive system',
      course: 'ANA',
      weight: 5,
      examQuestions: 26,
      keywords: [
        'stomach', 'intestine', 'oesophagus', 'liver', 'pancreas bile',
        'duodenum', 'ileum', 'jejunum', 'colon', 'rectum', 'digestion',
        'amylase', 'pepsin', 'lipase', 'absorption nutrient', 'villi',
        'peristalsis', 'gallbladder', 'bile duct'
      ]
    },
    {
      id: 'ana_skeletal',
      name: 'Skeletal system',
      course: 'ANA',
      weight: 4,
      examQuestions: 24,
      keywords: [
        'bone', 'femur', 'skull', 'vertebra', 'vertebrae', 'tibia',
        'fibula', 'humerus', 'radius', 'ulna', 'clavicle', 'sternum',
        'joint', 'cartilage', 'ligament', 'tendon', 'periosteum',
        'cranium', 'mandible', 'axial skeleton', 'appendicular'
      ]
    },
    {
      id: 'ana_cell_biology',
      name: 'Cell biology',
      course: 'ANA',
      weight: 4,
      examQuestions: 22,
      keywords: [
        'cell', 'nucleus', 'mitochondria', 'ribosome', 'golgi',
        'cell membrane', 'plasma membrane', 'cytoplasm', 'organelle',
        'mitosis', 'meiosis', 'diffusion', 'osmosis', 'active transport',
        'endoplasmic reticulum', 'lysosome', 'centriole'
      ]
    },
  ],

  ENG: [
    {
      id: 'eng_antonyms',
      name: 'Antonyms',
      course: 'ENG',
      weight: 10,
      examQuestions: 55,
      keywords: ['opposite', 'antonym', 'contrast', 'whereas', 'while', 'but']
    },
    {
      id: 'eng_synonyms',
      name: 'Synonyms',
      course: 'ENG',
      weight: 9,
      examQuestions: 50,
      keywords: ['nearest in meaning', 'synonym', 'closest', 'same meaning']
    },
    {
      id: 'eng_cloze',
      name: 'Cloze passage',
      course: 'ENG',
      weight: 9,
      examQuestions: 48,
      keywords: ['fill', 'blank', 'cloze', 'passage', 'complete the sentence']
    },
    {
      id: 'eng_idioms',
      name: 'Idioms & figurative language',
      course: 'ENG',
      weight: 8,
      examQuestions: 42,
      keywords: [
        'idiom', 'hit the roof', 'cold shoulder', 'bite off more',
        'piece of cake', 'back on feet', 'touch and go', 'pull socks',
        'this means', 'figurative'
      ]
    },
    {
      id: 'eng_grammar',
      name: 'Grammar & sentence completion',
      course: 'ENG',
      weight: 8,
      examQuestions: 40,
      keywords: [
        'tense', 'subject verb', 'preposition', 'conjunction',
        'grammar', 'sentence', 'plural', 'singular', 'agreement',
        'modal', 'conditional', 'comparative'
      ]
    },
    {
      id: 'eng_comprehension',
      name: 'Comprehension passages',
      course: 'ENG',
      weight: 6,
      examQuestions: 35,
      keywords: ['according to the passage', 'passage states', 'based on']
    },
    {
      id: 'eng_tag_questions',
      name: 'Tag questions',
      course: 'ENG',
      weight: 5,
      examQuestions: 28,
      keywords: ["isn't he", "aren't they", "doesn't he", "haven't you", "tag question"]
    },
    {
      id: 'eng_phrasal',
      name: 'Phrasal verbs',
      course: 'ENG',
      weight: 4,
      examQuestions: 22,
      keywords: ['get off', 'stand in', 'come down', 'fall through', 'phrasal verb']
    },
  ]
};

// Flatten all topics for easy lookup
export const ALL_TOPICS = Object.values(TOPICS).flat();

/**
 * Given a question text, returns the best-matching topic ID.
 * Used automatically after each question is answered.
 */
export function detectTopicFromQuestion(questionText) {
  const lower = questionText.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const topic of ALL_TOPICS) {
    const score = topic.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}