export interface IMember {
  _id: string;
  memberCode: string;
  fullName: string;
  email: string;
  bloodGroup?: string;
  profession?: string;
  nidNo?: string;
  birthRegistrationNo?: string;
  fatherName?: string;
  motherName?: string;
  mobileNo: string;
  dateOfBirth?: string;
  division?: string;
  district?: string;
  thana?: string;
  presentAddress?: string;

  designation: string;
  designationBn: string;
  councilCategory: "core_leadership" | "financial_leadership" | "general_member";

  role: "superadmin" | "admin" | "manager" | "member";
  password?: string;
  totalDeposit: number;
  savingsBalance: number;
  dueAmount: number;

  nomineeName?: string;
  nomineeRelation?: string;
  nomineeDob?: string;
  nomineeNid?: string;
  nomineeAddress?: string;
  nomineePictureUrl?: string;
  pictureUrl?: string;
  signatureUrl?: string;

  status: "active" | "inactive" | "blocked";
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

// ─── Initial Mock Members ───────────────────────────────────────────────────

export const INITIAL_MOCK_MEMBERS: IMember[] = [
  {
    _id: "mem-001",
    memberCode: "001",
    fullName: "MD AL AMIN",
    email: "alamin@friendsgoal.org",
    bloodGroup: "B+",
    profession: "Business",
    nidNo: "1992019283019",
    birthRegistrationNo: "2001928374829102",
    fatherName: "MD KADOM ALI",
    motherName: "MORIOM BEGUM",
    mobileNo: "01774987030",
    dateOfBirth: "11/15/1992",
    division: "Barisal",
    district: "Patuakhali",
    thana: "Bauphal",
    presentAddress: "Village: Gosinga, P.O: Gosinga-8620, P.S: Bauphal, Dist: Patuakhali.",
    designation: "General Member",
    designationBn: "সাধারণ সদস্য",
    councilCategory: "general_member",
    role: "member",
    totalDeposit: 20000,
    savingsBalance: 1000,
    dueAmount: 1000,
    nomineeName: "Fatema Akter",
    nomineeRelation: "Spouse",
    nomineeDob: "04/10/1996",
    nomineeNid: "1996029384712",
    nomineeAddress: "Village: Gosinga, P.O: Gosinga-8620, P.S: Bauphal, Dist: Patuakhali.",
    pictureUrl: "/images/hero/hero-1.png",
    status: "active",
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "mem-002",
    memberCode: "002",
    fullName: "MD JUWEL HASAN",
    email: "juwel@friendsgoal.org",
    bloodGroup: "B+",
    profession: "Business",
    nidNo: "1993029384719",
    birthRegistrationNo: "1993029384719001",
    fatherName: "MD KADOM ALI",
    motherName: "MD KADOM ALI",
    mobileNo: "01774987030",
    dateOfBirth: "11/15/1992",
    division: "Barisal",
    district: "Patuakhali",
    thana: "Bauphal",
    presentAddress: "Village: Gosinga, P.O: Gosinga-8620, P.S: Bauphal, Dist: Patuakhali.",
    designation: "Executive Member",
    designationBn: "নির্বাহী সদস্য",
    councilCategory: "core_leadership",
    role: "member",
    totalDeposit: 20000,
    savingsBalance: 1000,
    dueAmount: 1000,
    nomineeName: "Fatema Begum",
    nomineeRelation: "Spouse",
    nomineeDob: "01/10/1995",
    nomineeNid: "1995010203040",
    nomineeAddress: "Village: Gosinga, Bauphal, Patuakhali",
    pictureUrl: "/images/hero/hero-2.png",
    status: "active",
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "mem-003",
    memberCode: "003",
    fullName: "MD BELAL HOSSAIN",
    email: "belal@friendsgoal.org",
    bloodGroup: "O+",
    profession: "Business",
    nidNo: "1990038291029",
    birthRegistrationNo: "1990038291029002",
    fatherName: "MD IBRAHIM HOSSAIN",
    motherName: "SALMA KHATUN",
    mobileNo: "01712345678",
    dateOfBirth: "12/01/1993",
    division: "Barisal",
    district: "Patuakhali",
    thana: "Rajapur",
    presentAddress: "Rajapur, Patuakhali",
    designation: "Secretary",
    designationBn: "সচিব",
    councilCategory: "core_leadership",
    role: "admin",
    totalDeposit: 30450,
    savingsBalance: 4554,
    dueAmount: 1000,
    nomineeName: "Nusrat Jahan",
    nomineeRelation: "Spouse",
    nomineeDob: "05/12/1995",
    nomineeNid: "1995123456789",
    nomineeAddress: "Rajapur, Patuakhali",
    pictureUrl: "/images/hero/hero-3.png",
    status: "active",
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "mem-004",
    memberCode: "004",
    fullName: "SHAHIN ALAM",
    email: "shahin@friendsgoal.org",
    bloodGroup: "A+",
    profession: "Engineer",
    nidNo: "1994029384718",
    birthRegistrationNo: "1994029384718003",
    fatherName: "MD MOKBUL HOSSAIN",
    motherName: "RAHIMA BEGUM",
    mobileNo: "01812345678",
    dateOfBirth: "06/20/1994",
    division: "Dhaka",
    district: "Dhaka",
    thana: "Uttara",
    presentAddress: "Uttara, Dhaka",
    designation: "Treasurer",
    designationBn: "কোষাধ্যক্ষ",
    councilCategory: "financial_leadership",
    role: "admin",
    totalDeposit: 25000,
    savingsBalance: 3200,
    dueAmount: 0,
    nomineeName: "Suraiya Begum",
    nomineeRelation: "Mother",
    pictureUrl: "/images/hero/hero-4.png",
    status: "active",
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "mem-005",
    memberCode: "005",
    fullName: "MIRAJUL ISLAM",
    email: "mirajul@friendsgoal.org",
    bloodGroup: "AB+",
    profession: "Service",
    nidNo: "1991029384717",
    birthRegistrationNo: "1991029384717004",
    fatherName: "MD ABDUL KARIM",
    motherName: "JAHANARA BEGUM",
    mobileNo: "01912345678",
    dateOfBirth: "08/14/1991",
    division: "Barisal",
    district: "Patuakhali",
    thana: "Bauphal",
    presentAddress: "Bauphal, Patuakhali",
    designation: "President",
    designationBn: "সভাপতি",
    councilCategory: "core_leadership",
    role: "superadmin",
    totalDeposit: 40000,
    savingsBalance: 8500,
    dueAmount: 0,
    nomineeName: "Rashida Karim",
    nomineeRelation: "Spouse",
    pictureUrl: "/images/hero/hero-5.png",
    status: "active",
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "mem-006",
    memberCode: "006",
    fullName: "RAKIBUL HASAN",
    email: "rakibul@friendsgoal.org",
    bloodGroup: "O+",
    profession: "Teacher",
    nidNo: "1995029384716",
    birthRegistrationNo: "1995029384716005",
    fatherName: "MD SIRAJUL ISLAM",
    motherName: "HASINA BEGUM",
    mobileNo: "01612345678",
    dateOfBirth: "03/10/1995",
    division: "Dhaka",
    district: "Dhaka",
    thana: "Mirpur",
    presentAddress: "Mirpur-10, Dhaka",
    designation: "Financial Member",
    designationBn: "আর্থিক সদস্য",
    councilCategory: "financial_leadership",
    role: "member",
    totalDeposit: 20000,
    savingsBalance: 1500,
    dueAmount: 500,
    nomineeName: "Monira Akter",
    nomineeRelation: "Sister",
    pictureUrl: "/images/hero/hero-1.png",
    status: "active",
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

// In-memory store for client-side persistence during local dev / mock mode
let inMemoryMembers: IMember[] = [...INITIAL_MOCK_MEMBERS];

// ─── API Client Functions ─────────────────────────────────────────────────────

export async function fetchMembersApi(params?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  councilCategory?: string;
  designation?: string;
}): Promise<{ data: IMember[]; meta: TMeta }> {
  const query = new URLSearchParams();
  if (params?.searchTerm) query.append("searchTerm", params.searchTerm);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.councilCategory) query.append("councilCategory", params.councilCategory);
  if (params?.designation) query.append("designation", params.designation);

  try {
    const res = await fetch(`${BASE_URL}/members?${query.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          data: json.data,
          meta: json.meta || {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: json.data.length,
            totalPage: Math.ceil(json.data.length / (params?.limit || 10)),
          },
        };
      }
    }
  } catch (err) {
    // Fallback to in-memory store
  }

  // Client-side filtering fallback
  let filtered = [...inMemoryMembers];
  if (params?.searchTerm) {
    const term = params.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.fullName.toLowerCase().includes(term) ||
        m.mobileNo.toLowerCase().includes(term) ||
        m.memberCode.toLowerCase().includes(term) ||
        (m.profession && m.profession.toLowerCase().includes(term))
    );
  }
  if (params?.councilCategory) {
    filtered = filtered.filter((m) => m.councilCategory === params.councilCategory);
  }
  if (params?.designation) {
    filtered = filtered.filter((m) => m.designation === params.designation);
  }

  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const total = filtered.length;
  const totalPage = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;
  const data = filtered.slice(skip, skip + limit);

  return {
    data,
    meta: { page, limit, total, totalPage },
  };
}

export async function fetchMemberByIdApi(id: string): Promise<IMember> {
  try {
    const res = await fetch(`${BASE_URL}/members/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // Fallback
  }

  const found = inMemoryMembers.find((m) => m._id === id || m.memberCode === id);
  if (!found) {
    throw new Error("Member not found");
  }
  return found;
}

export async function fetchPublicCouncilApi(params?: {
  category?: string;
  designation?: string;
  search?: string;
}): Promise<IMember[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append("category", params.category);
  if (params?.designation) query.append("designation", params.designation);
  if (params?.search) query.append("search", params.search);

  try {
    const res = await fetch(`${BASE_URL}/members/public-council?${query.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // Fallback
  }

  let list = inMemoryMembers.filter((m) => m.status === "active");
  if (params?.category) {
    list = list.filter((m) => m.councilCategory === params.category);
  }
  if (params?.designation) {
    list = list.filter((m) => m.designation === params.designation);
  }
  return list;
}

export async function createMemberApi(payload: Partial<IMember>): Promise<IMember> {
  try {
    const res = await fetch(`${BASE_URL}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // Fallback
  }

  const nextCode = String(inMemoryMembers.length + 1).padStart(3, "0");
  const newMember: IMember = {
    _id: `mem-${Date.now()}`,
    memberCode: payload.memberCode || nextCode,
    fullName: payload.fullName || "New Member",
    email: payload.email || `member${nextCode}@friendsgoal.org`,
    mobileNo: payload.mobileNo || "01700000000",
    designation: payload.designation || "General Member",
    designationBn: payload.designationBn || "সাধারণ সদস্য",
    councilCategory: payload.councilCategory || "general_member",
    role: payload.role || "member",
    totalDeposit: payload.totalDeposit || 0,
    savingsBalance: payload.savingsBalance || 0,
    dueAmount: payload.dueAmount || 0,
    status: "active",
    isDeleted: false,
    ...payload,
  };

  inMemoryMembers.unshift(newMember);
  return newMember;
}

export async function updateMemberApi(id: string, payload: Partial<IMember>): Promise<IMember> {
  try {
    const res = await fetch(`${BASE_URL}/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // Fallback
  }

  const index = inMemoryMembers.findIndex((m) => m._id === id || m.memberCode === id);
  if (index !== -1) {
    inMemoryMembers[index] = { ...inMemoryMembers[index], ...payload };
    return inMemoryMembers[index];
  }

  throw new Error("Member not found");
}

export async function deleteMemberApi(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/members/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      return;
    }
  } catch (err) {
    // Fallback
  }

  inMemoryMembers = inMemoryMembers.filter((m) => m._id !== id && m.memberCode !== id);
}
