export interface Employee { id: number; name: string; department: string; }
export interface Badge { code: string; name: string; points: number; }
export interface Reward { id: number; name: string; description: string; cost: number; }

export const fakeEmployees: Employee[] = [
  { id: 1, name: "Alex Johnson", department: "Mobile Sales" },
  { id: 2, name: "Sam Patel", department: "Geek Squad" },
  { id: 3, name: "Jamie Nguyen", department: "Home Theatre" },
];

export const fakeBadges: Badge[] = [
  { code: "TEAM_PLAYER", name: "Team Player", points: 50 },
  { code: "SALES_STAR", name: "Sales Star", points: 100 },
  { code: "CUSTOMER_HERO", name: "Customer Hero", points: 80 },
];

export const fakeRewards: Reward[] = [
  { id: 1, name: "Coffee Card", description: "Coffee on us ☕", cost: 50 },
  { id: 2, name: "BB Swag", description: "T-shirt / cap", cost: 120 },
  { id: 3, name: "Lunch with Manager", description: "Pick a day", cost: 200 },
];

export const currentUser = { id: 99, name: "Erfan", department: "Computers", points: 540 };

export function fakeLeaderboard(scope: "weekly" | "monthly" | "all" = "monthly") {
  return [
    { id: 1, name: "Alex Johnson", department: "Mobile Sales", points: 720 },
    { id: 2, name: "Sam Patel", department: "Geek Squad", points: 640 },
    { id: 3, name: "Jamie Nguyen", department: "Home Theatre", points: 560 },
  ];
}

export const fakeHistory = [
  { text: "Received Team Player from Sam", delta: +50 },
  { text: "Redeemed Coffee Card", delta: -50 },
  { text: "Received Sales Star from Jamie", delta: +100 },
];

export function sendRecognition(params: { receiverId: number; badgeCode: string; points: number; note: string; }) {
  console.log("sendRecognition", params);
  return { ok: true };
}

export function redeemReward(id: number) {
  console.log("redeemReward", id);
  return { ok: true };
}

export function addReward(r: { name: string; description: string; cost: number; }) {
  const id = Math.max(...fakeRewards.map(x => x.id)) + 1;
  fakeRewards.push({ id, ...r });
  return { ok: true };
}
