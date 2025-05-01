import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { RecentProposalsTable } from "@/components/proposal-table";
import { TopContributorsGrid } from "@/components/contributor-card";
import { FileText, CheckCircle, Users, GitBranch } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  TooltipProps,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Proposal, Contributor, Analytics } from "@shared/schema";

export default function Dashboard() {
  // Fetch recent proposals
  const { data: proposals, isLoading: proposalsLoading } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals/recent/5"],
  });

  // Fetch top contributors
  const { data: contributors, isLoading: contributorsLoading } = useQuery<Contributor[]>({
    queryKey: ["/api/contributors/top/4"],
  });

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
  });

  // Colors for charts
  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#6b7280"];

  // Custom tooltip for charts
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm text-primary">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          title="Total Proposals"
          value={analytics?.proposalData.totalProposals || 0}
          change={{ value: 12, timeframe: "last month", isPositive: true }}
          iconBgColor="bg-blue-100 dark:bg-blue-900"
          iconColor="text-blue-500 dark:text-blue-300"
          isLoading={analyticsLoading}
        />
        <StatCard
          icon={<CheckCircle className="h-5 w-5" />}
          title="Final Status"
          value={analytics?.proposalData.byStatus.Final || 0}
          change={{ value: 8, timeframe: "last month", isPositive: true }}
          iconBgColor="bg-purple-100 dark:bg-purple-900"
          iconColor="text-purple-500 dark:text-purple-300"
          isLoading={analyticsLoading}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          title="Active Contributors"
          value={analytics?.contributorData.totalContributors || 0}
          change={{ value: 23, timeframe: "last month", isPositive: true }}
          iconBgColor="bg-green-100 dark:bg-green-900"
          iconColor="text-green-500 dark:text-green-300"
          isLoading={analyticsLoading}
        />
        <StatCard
          icon={<GitBranch className="h-5 w-5" />}
          title="Draft Proposals"
          value={analytics?.proposalData.byStatus.Draft || 0}
          change={{ value: 5, timeframe: "last month", isPositive: false }}
          iconBgColor="bg-amber-100 dark:bg-amber-900"
          iconColor="text-amber-500 dark:text-amber-300"
          isLoading={analyticsLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activity chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Proposal Activity</CardTitle>
            <Select defaultValue="30">
              <SelectTrigger className="w-[145px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {analyticsLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-full w-full animate-pulse rounded-md bg-muted"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics?.proposalData.monthlyActivity || []}
                    margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      name="Proposals"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories pie chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Proposal Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {analyticsLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-full w-full animate-pulse rounded-md bg-muted"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "EIPs", value: analytics?.proposalData.byType.EIP || 0 },
                        { name: "ERCs", value: analytics?.proposalData.byType.ERC || 0 },
                        { name: "RIPs", value: analytics?.proposalData.byType.RIP || 0 },
                      ]}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {[
                        { name: "EIPs", value: analytics?.proposalData.byType.EIP || 0 },
                        { name: "ERCs", value: analytics?.proposalData.byType.ERC || 0 },
                        { name: "RIPs", value: analytics?.proposalData.byType.RIP || 0 },
                      ].map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: "10px" }}
                    />
                    <Tooltip formatter={(value) => [`${value} proposals`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent proposals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Recent Proposals</CardTitle>
          <Link href="/explorer">
            <div className="text-sm text-primary hover:underline cursor-pointer">View all</div>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <RecentProposalsTable
            proposals={proposals || []}
            isLoading={proposalsLoading}
            limit={5}
          />
        </CardContent>
      </Card>

      {/* Top contributors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Top Contributors</CardTitle>
          <Link href="/leaderboard">
            <div className="text-sm text-primary hover:underline cursor-pointer">View leaderboard</div>
          </Link>
        </CardHeader>
        <CardContent className="p-4">
          <TopContributorsGrid
            contributors={contributors || []}
            isLoading={contributorsLoading}
            limit={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}
