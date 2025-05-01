import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Analytics } from "@shared/schema";

export default function AnalyticsPage() {
  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
  });

  // Chart colors
  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#6b7280", "#0ea5e9"];

  // Convert object data to array for charts
  const getStatusData = () => {
    if (!analytics) return [];
    return Object.entries(analytics.proposalData.byStatus).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getTypeData = () => {
    if (!analytics) return [];
    return Object.entries(analytics.proposalData.byType).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Mock contributor activity data (this would come from the API in a real implementation)
  const contributorActivityData = [
    { month: "Jan", commits: 43, prs: 32, reviews: 22 },
    { month: "Feb", commits: 52, prs: 36, reviews: 28 },
    { month: "Mar", commits: 50, prs: 40, reviews: 30 },
    { month: "Apr", commits: 70, prs: 45, reviews: 35 },
    { month: "May", commits: 65, prs: 48, reviews: 40 },
    { month: "Jun", commits: 85, prs: 55, reviews: 45 },
    { month: "Jul", commits: 95, prs: 60, reviews: 50 },
  ];

  // Mock status transition data
  const statusTransitionData = [
    { month: "Jan", draft: 20, review: 10, lastCall: 5, final: 8 },
    { month: "Feb", draft: 25, review: 15, lastCall: 8, final: 10 },
    { month: "Mar", draft: 15, review: 20, lastCall: 10, final: 5 },
    { month: "Apr", draft: 20, review: 25, lastCall: 12, final: 8 },
    { month: "May", draft: 30, review: 20, lastCall: 15, final: 10 },
    { month: "Jun", draft: 25, review: 30, lastCall: 20, final: 15 },
    { month: "Jul", draft: 35, review: 25, lastCall: 15, final: 20 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-muted rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-muted rounded"></div>
        </div>
        
        {/* Loading skeleton for tabs and charts */}
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 w-1/4 bg-muted rounded"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full animate-pulse bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Visualize statistics and trends about Ethereum proposals and contributor activity.
        </p>
      </div>
      
      <Tabs defaultValue="proposals">
        <TabsList className="mb-4">
          <TabsTrigger value="proposals">Proposal Analytics</TabsTrigger>
          <TabsTrigger value="contributors">Contributor Analytics</TabsTrigger>
          <TabsTrigger value="github">GitHub Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proposals" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Proposals by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${value} proposals`,
                          "",
                        ]}
                      />
                      <Legend layout="vertical" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Proposals by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getTypeData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip
                        formatter={(value) => [
                          `${value} proposals`,
                          "",
                        ]}
                      />
                      <Bar dataKey="value" name="Proposals" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Proposal Activity Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics?.proposalData.monthlyActivity || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Proposals"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Status Transitions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={statusTransitionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="draft"
                        name="Draft"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                      <Area
                        type="monotone"
                        dataKey="review"
                        name="Review"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                      />
                      <Area
                        type="monotone"
                        dataKey="lastCall"
                        name="Last Call"
                        stackId="1"
                        stroke="#ffc658"
                        fill="#ffc658"
                      />
                      <Area
                        type="monotone"
                        dataKey="final"
                        name="Final"
                        stackId="1"
                        stroke="#ff8042"
                        fill="#ff8042"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contributors" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={
                        analytics?.contributorData.topContributors.slice(0, 10) || []
                      }
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-muted-foreground" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        className="text-muted-foreground" 
                        width={100}
                      />
                      <Tooltip />
                      <Bar 
                        dataKey="count" 
                        name="Proposals" 
                        fill="#3b82f6" 
                        radius={[0, 4, 4, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contributor Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={contributorActivityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="commits"
                        name="Commits"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="prs"
                        name="Pull Requests"
                        stroke="#10b981"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="reviews"
                        name="Reviews"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="github" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>GitHub Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={contributorActivityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="commits" 
                        name="Commits" 
                        stackId="a" 
                        fill="#3b82f6" 
                      />
                      <Bar 
                        dataKey="prs" 
                        name="Pull Requests" 
                        stackId="a" 
                        fill="#10b981" 
                      />
                      <Bar 
                        dataKey="reviews" 
                        name="Reviews" 
                        stackId="a" 
                        fill="#8b5cf6" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
