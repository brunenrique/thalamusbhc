"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Save, Sparkles } from "lucide-react";
import { generateSessionNoteTemplate, type GenerateSessionNoteTemplateOutput } from '@/ai/flows/generate-session-note-template';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface TemplateEditorProps {
  templateId?: string; // For editing existing template
  initialName?: string;
  initialContent?: string;
  initialPatientName?: string;
  initialSessionSummary?: string;
}

export default function TemplateEditor({
  templateId,
  initialName = "",
  initialContent = "",
  initialPatientName = "",
  initialSessionSummary = ""
}: TemplateEditorProps) {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState(initialName);
  const [templateContent, setTemplateContent] = useState(initialContent);
  const [patientName, setPatientName] = useState(initialPatientName);
  const [sessionSummary, setSessionSummary] = useState(initialSessionSummary);
  const [therapistInstructions, setTherapistInstructions] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateTemplate = async () => {
    if (!patientName || !sessionSummary) {
      toast({
        title: "Missing Information",
        description: "Please provide Patient Name and Session Summary to generate a template.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result: GenerateSessionNoteTemplateOutput = await generateSessionNoteTemplate({
        patientName,
        sessionSummary,
        therapistInstructions,
      });
      setTemplateContent(result.template);
      toast({
        title: "Template Generated",
        description: "AI has generated a template draft.",
      });
    } catch (error) {
      console.error("Error generating template:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Saving template:", { templateId, templateName, templateContent });
    toast({
      title: "Template Saved",
      description: `Template "${templateName}" has been saved successfully.`,
    });
    setIsSaving(false);
  };

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Brain className="mr-2 h-6 w-6 text-accent" />
          {templateId ? "Edit Template" : "Create New Template"}
        </CardTitle>
        <CardDescription>
          Use the AI assistant to help draft your session note template or write your own.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g., Initial Consultation Notes"
          />
        </div>

        <Card className="bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">AI Template Generation Assistant</p>
            <div className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <Label htmlFor="patientName">Patient Name (for AI assist)</Label>
                    <Input id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="sessionSummary">Session Summary (for AI assist)</Label>
                    <Input id="sessionSummary" value={sessionSummary} onChange={(e) => setSessionSummary(e.target.value)} placeholder="Brief session overview..." />
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="therapistInstructions">Specific Instructions (optional)</Label>
                <Textarea id="therapistInstructions" value={therapistInstructions} onChange={(e) => setTherapistInstructions(e.target.value)} placeholder="e.g., Focus on mood, include a section for treatment plan..." rows={2}/>
            </div>
            <Button onClick={handleGenerateTemplate} disabled={isGenerating || !patientName || !sessionSummary} variant="outline">
              {isGenerating ? <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
        </Card>
        
        <div className="space-y-2">
          <Label htmlFor="templateContent">Template Content</Label>
          {isGenerating ? (
            <Skeleton className="h-48 w-full" />
          ): (
            <Textarea
              id="templateContent"
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
              placeholder="Type your template content here... \n\nExample Sections:\n- Patient Presentation:\n- Key Discussion Points:\n- Interventions Used:\n- Patient Response:\n- Risk Assessment:\n- Plan for Next Session:"
              rows={15}
              className="min-h-[300px] font-mono text-sm"
            />
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveTemplate} disabled={isSaving || !templateName || !templateContent} className="ml-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          {isSaving ? <Save className="mr-2 h-4 w-4 animate-pulse" /> : <Save className="mr-2 h-4 w-4" />}
          {isSaving ? "Saving..." : "Save Template"}
        </Button>
      </CardFooter>
    </Card>
  );
}
