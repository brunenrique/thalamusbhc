"use client";

import React, { useState } from "react";
import { Button } from "@/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/atoms/card";
import { Textarea } from "@/atoms/textarea";
import { Input } from "@/atoms/input";
import { Label } from "@/atoms/label";
import { Wand2, Sparkles, Loader2, FileText } from "lucide-react";
import { createSessionNoteTemplate, CreateSessionNoteTemplateOutput } from "@/features/templateGenerator/services/session-note-template-creation";

export function TemplatesPage() {
  const [formData, setFormData] = useState({
    templateName: "CBT Session Template",
    psychologistStyle: "Cognitive Behavioral Therapy (CBT), collaborative, goal-oriented.",
    sessionType: "Individual Therapy",
    keywords: "anxiety, negative thought patterns, cognitive restructuring",
  });
  const [template, setTemplate] = useState<CreateSessionNoteTemplateOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleGenerate = async () => {
    setIsLoading(true);
    setTemplate(null);
    try {
      const result = await createSessionNoteTemplate(formData);
      setTemplate(result);
    } catch (error) {
      console.error("Failed to create template:", error);
      // Use toast for error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="size-5" />
            Template Generator
          </CardTitle>
          <CardDescription>
            Create session note templates with AI assistance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input id="templateName" value={formData.templateName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="psychologistStyle">Your Style/Modality</Label>
            <Textarea id="psychologistStyle" value={formData.psychologistStyle} onChange={handleInputChange} placeholder="e.g., Psychodynamic, solution-focused..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionType">Session Type</Label>
            <Input id="sessionType" value={formData.sessionType} onChange={handleInputChange} placeholder="e.g., Couple's therapy, child assessment..." />
          </div>
           <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input id="keywords" value={formData.keywords} onChange={handleInputChange} placeholder="e.g., trauma, grief, development" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Generating..." : "Create Template"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <FileText className="size-5" />
                Generated Template
            </CardTitle>
            <CardDescription>
                Review and edit the AI-generated template below.
            </CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">
                    Building your template...
                </p>
                </div>
            </div>
            ) : (
            <Textarea
                value={template ? template.templateContent : "Your generated template will appear here..."}
                readOnly={!template}
                className="min-h-[450px] text-base"
                placeholder="Your generated template will appear here..."
            />
           )}
        </CardContent>
         {template && !isLoading && (
            <CardFooter className="justify-end gap-2">
                <Button variant="outline">Copy</Button>
                <Button>Save Template</Button>
            </CardFooter>
         )}
      </Card>
    </div>
  );
}
