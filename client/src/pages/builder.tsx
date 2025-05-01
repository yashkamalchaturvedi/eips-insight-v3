import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { insertProposalSchema, PROPOSAL_STATUS, PROPOSAL_CATEGORIES, PROPOSAL_TYPES } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

// Create a form schema with validation
const formSchema = insertProposalSchema.extend({
  content: z.string().min(10, "Proposal content should be at least 10 characters long"),
  proposalId: z.string().regex(/^(EIP|ERC|RIP)-\d+$/, "ID must follow the format: EIP-123, ERC-123, or RIP-123"),
});

export default function Builder() {
  const { toast } = useToast();
  const [tab, setTab] = useState("edit");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposalId: "",
      title: "",
      author: "",
      category: "Core",
      type: "EIP",
      status: "Draft",
      content: "# Title\n\n## Abstract\n\nA brief description of the proposal.\n\n## Motivation\n\nWhy is this proposal needed?\n\n## Specification\n\nThe technical details of the proposal.\n\n## Rationale\n\nExplanation of design decisions.\n\n## Backwards Compatibility\n\nAny potential issues with existing standards or implementations.\n\n## Security Considerations\n\nSecurity implications of the proposal.",
      githubUrl: "",
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/proposals", values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Proposal created!",
        description: "Your proposal has been successfully created.",
      });
      
      // Reset the form
      form.reset({
        proposalId: "",
        title: "",
        author: "",
        category: "Core",
        type: "EIP",
        status: "Draft",
        content: "# Title\n\n## Abstract\n\nA brief description of the proposal.\n\n## Motivation\n\nWhy is this proposal needed?\n\n## Specification\n\nThe technical details of the proposal.\n\n## Rationale\n\nExplanation of design decisions.\n\n## Backwards Compatibility\n\nAny potential issues with existing standards or implementations.\n\n## Security Considerations\n\nSecurity implications of the proposal.",
        githubUrl: "",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error creating proposal",
        description: "There was an error creating your proposal. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }
  
  // Preview formatting function
  const formatPreview = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Handle headers
      if (line.startsWith("# ")) {
        return <h1 key={i} className="mt-4 text-2xl font-bold">{line.substring(2)}</h1>;
      } else if (line.startsWith("## ")) {
        return <h2 key={i} className="mt-3 text-xl font-semibold">{line.substring(3)}</h2>;
      } else if (line.startsWith("### ")) {
        return <h3 key={i} className="mt-2 text-lg font-medium">{line.substring(4)}</h3>;
      } else if (line.trim() === "") {
        return <br key={i} />;
      } else {
        return <p key={i}>{line}</p>;
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proposal Builder</h1>
        <p className="text-muted-foreground">
          Create and edit Ethereum improvement proposals using the standardized format.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Proposal</CardTitle>
          <CardDescription>
            Fill in the details of your proposal and use the editor to write the content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="proposalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal ID</FormLabel>
                      <FormControl>
                        <Input placeholder="EIP-1234" {...field} />
                      </FormControl>
                      <FormDescription>
                        Format: EIP-123, ERC-123, or RIP-123
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My Ethereum Proposal" {...field} />
                      </FormControl>
                      <FormDescription>
                        A concise title for your proposal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your name or username
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/ethereum/EIPs/..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Link to the GitHub repository or PR
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROPOSAL_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of proposal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROPOSAL_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category of the proposal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROPOSAL_STATUS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The current status of the proposal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                  <TabsList className="mb-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit" className="space-y-2">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proposal Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="font-mono h-96 resize-none"
                              placeholder="# Title..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Use Markdown syntax for formatting
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    <Card>
                      <CardHeader>
                        <CardTitle>{form.watch("title") || "Proposal Title"}</CardTitle>
                        <CardDescription>
                          {form.watch("proposalId") || "EIP-XXXX"} by {form.watch("author") || "Author"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="prose dark:prose-invert max-w-none">
                        {formatPreview(form.watch("content"))}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="w-full md:w-auto"
              >
                {mutation.isPending ? "Submitting..." : "Submit Proposal"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 border-t px-6 py-4">
          <h3 className="text-sm font-medium">Tips for writing a good proposal:</h3>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Be clear and concise in your writing</li>
            <li>Provide a strong motivation for why this proposal is needed</li>
            <li>Include detailed technical specifications</li>
            <li>Consider backward compatibility issues</li>
            <li>Address potential security concerns</li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  );
}
