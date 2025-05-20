export interface CustomerResponse {
    idCustomer: string;       // UUID as string
    idUser: string;
    name: string;
    nik: string;
    dateOfBirth: string;      // LocalDate → string ISO format
    placeOfBirth: string;
    telpNo: string;
    address: string;
    motherMaidenName: string;
    occupation: string;
    salary: number;           // BigDecimal → number
    homeOwnershipStatus: string;
    emergencyCall: string;
    creditLimit: number;      // BigDecimal → number
    accountNo: string;
    urlKtp: string;
    urlSelfie: string;
  }
  