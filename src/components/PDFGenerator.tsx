"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  FileText, 
  Image, 
  Table, 
  BarChart3, 
  Calendar,
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Settings,
  Eye,
  Save,
  Share
} from "lucide-react";

interface PDFReportData {
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  sections: PDFSection[];
  metadata?: {
    generatedBy: string;
    version: string;
    tags: string[];
  };
}

interface PDFSection {
  id: string;
  title: string;
  type: 'text' | 'table' | 'chart' | 'image' | 'list';
  content: any;
  options?: {
    showHeader?: boolean;
    showFooter?: boolean;
    pageBreak?: boolean;
  };
}

interface PDFGeneratorProps {
  data?: PDFReportData;
  onGenerated?: (blob: Blob) => void;
  template?: 'standard' | 'minimal' | 'detailed' | 'executive';
}

export default function PDFGenerator({ 
  data, 
  onGenerated, 
  template = 'standard' 
}: PDFGeneratorProps) {
  const [reportData, setReportData] = useState<PDFReportData>(data || {
    title: 'Security Guard Report',
    subtitle: 'Daily Operations Summary',
    author: 'Security Manager',
    date: new Date().toISOString().split('T')[0],
    sections: [],
    metadata: {
      generatedBy: 'Securitify',
      version: '1.0.0',
      tags: ['security', 'daily-report']
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(template);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const templates = {
    standard: {
      name: 'Standard Report',
      description: 'Comprehensive report with all sections',
      icon: FileText
    },
    minimal: {
      name: 'Minimal Report',
      description: 'Clean and simple layout',
      icon: FileText
    },
    detailed: {
      name: 'Detailed Report',
      description: 'Include charts and detailed analytics',
      icon: BarChart3
    },
    executive: {
      name: 'Executive Summary',
      description: 'High-level overview for management',
      icon: Users
    }
  };

  // Add a new section to the report
  const addSection = (type: PDFSection['type']) => {
    const newSection: PDFSection = {
      id: `section_${Date.now()}`,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      type,
      content: type === 'text' ? '' : 
               type === 'table' ? { headers: [], rows: [] } :
               type === 'chart' ? { type: 'bar', data: [] } :
               type === 'image' ? '' : []
    };

    setReportData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  // Update section content
  const updateSection = (sectionId: string, content: any) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, content } : section
      )
    }));
  };

  // Remove section
  const removeSection = (sectionId: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  // Generate PDF
  const generatePDF = async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate PDF generation progress
      const steps = [
        { message: 'Preparing content...', progress: 20 },
        { message: 'Processing images...', progress: 40 },
        { message: 'Generating charts...', progress: 60 },
        { message: 'Formatting layout...', progress: 80 },
        { message: 'Creating PDF...', progress: 100 }
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(steps[i].progress);
      }

      // Create a simple PDF-like blob (in real implementation, use jsPDF or similar)
      const pdfContent = generatePDFContent(reportData, selectedTemplate);
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      onGenerated?.(blob);
      
      // Download the PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportData.title.replace(/\s+/g, '_')}_${reportData.date}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  // Generate PDF content (simplified - in real implementation, use a proper PDF library)
  const generatePDFContent = (data: PDFReportData, template: string): string => {
    let content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length ${data.title.length + 100}
>>
stream
BT
/F1 18 Tf
100 750 Td
(${data.title}) Tj
/F1 12 Tf
100 730 Td
(${data.date}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000302 00000 n 
0000000432 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
523
%%EOF`;

    return content;
  };

  // Preview report
  const previewReport = () => {
    setPreviewMode(true);
  };

  // Save report template
  const saveTemplate = () => {
    const templateName = prompt('Enter template name:');
    if (templateName) {
      localStorage.setItem(`pdf_template_${templateName}`, JSON.stringify(reportData));
      alert('Template saved successfully!');
    }
  };

  // Load template
  const loadTemplate = (templateName: string) => {
    const saved = localStorage.getItem(`pdf_template_${templateName}`);
    if (saved) {
      setReportData(JSON.parse(saved));
      alert('Template loaded successfully!');
    }
  };

  const getSavedTemplates = () => {
    const templates: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('pdf_template_')) {
        templates.push(key.replace('pdf_template_', ''));
      }
    }
    return templates;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>PDF Report Generator</span>
            </div>
            <Badge variant="outline">
              {templates[selectedTemplate as keyof typeof templates].name}
            </Badge>
          </CardTitle>
          <CardDescription>
            Generate professional PDF reports for security operations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Report Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Report Title</label>
              <Input
                value={reportData.title}
                onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter report title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Author</label>
              <Input
                value={reportData.author}
                onChange={(e) => setReportData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={reportData.date}
                onChange={(e) => setReportData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Template</label>
              <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as 'standard' | 'minimal' | 'detailed' | 'executive')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(templates).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={saveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
            <Select onValueChange={loadTemplate}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Load Template" />
              </SelectTrigger>
              <SelectContent>
                {getSavedTemplates().map(template => (
                  <SelectItem key={template} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Report Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Report Sections</CardTitle>
          <CardDescription>Add and configure report sections</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Add Section Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => addSection('text')}>
              <FileText className="w-4 h-4 mr-2" />
              Add Text
            </Button>
            <Button variant="outline" onClick={() => addSection('table')}>
              <Table className="w-4 h-4 mr-2" />
              Add Table
            </Button>
            <Button variant="outline" onClick={() => addSection('chart')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Add Chart
            </Button>
            <Button variant="outline" onClick={() => addSection('image')}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image className="w-4 h-4 mr-2" />
              Add Image
            </Button>
            <Button variant="outline" onClick={() => addSection('list')}>
              <List className="w-4 h-4 mr-2" />
              Add List
            </Button>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {reportData.sections.map((section, index) => (
              <Card key={section.id} className="border-dashed">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      {section.type === 'text' && <FileText className="w-4 h-4 mr-2" />}
                      {section.type === 'table' && <Table className="w-4 h-4 mr-2" />}
                      {section.type === 'chart' && <BarChart3 className="w-4 h-4 mr-2" />}
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      {section.type === 'image' && <Image className="w-4 h-4 mr-2" />}
                      {section.type === 'list' && <List className="w-4 h-4 mr-2" />}
                      {section.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {section.type === 'text' && (
                    <Textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      placeholder="Enter text content..."
                      rows={4}
                    />
                  )}
                  
                  {section.type === 'table' && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Table headers (comma-separated)"
                        value={section.content.headers?.join(', ') || ''}
                        onChange={(e) => updateSection(section.id, {
                          ...section.content,
                          headers: e.target.value.split(',').map(h => h.trim())
                        })}
                      />
                      <Textarea
                        placeholder="Table data (one row per line, comma-separated values)"
                        value={section.content.rows?.join('\n') || ''}
                        onChange={(e) => updateSection(section.id, {
                          ...section.content,
                          rows: e.target.value.split('\n').map(row => 
                            row.split(',').map(cell => cell.trim())
                          )
                        })}
                        rows={4}
                      />
                    </div>
                  )}
                  
                  {section.type === 'chart' && (
                    <div className="space-y-2">
                      <Select
                        value={section.content.type || 'bar'}
                        onValueChange={(value) => updateSection(section.id, {
                          ...section.content,
                          type: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chart type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        placeholder="Chart data (JSON format)"
                        value={JSON.stringify(section.content.data || [], null, 2)}
                        onChange={(e) => {
                          try {
                            const data = JSON.parse(e.target.value);
                            updateSection(section.id, {
                              ...section.content,
                              data
                            });
                          } catch {
                            // Invalid JSON, ignore
                          }
                        }}
                        rows={4}
                      />
                    </div>
                  )}
                  
                  {section.type === 'image' && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Image URL or base64 data"
                        value={section.content}
                        onChange={(e) => updateSection(section.id, e.target.value)}
                      />
                      {section.content && (
                        <div className="mt-2">
                          <img
                            src={section.content}
                            alt="Report image preview"
                            className="max-w-full h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {section.type === 'list' && (
                    <Textarea
                      value={section.content.join('\n')}
                      onChange={(e) => updateSection(section.id, e.target.value.split('\n'))}
                      placeholder="List items (one per line)"
                      rows={4}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button
              onClick={generatePDF}
              disabled={isGenerating || reportData.sections.length === 0}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate PDF'}
            </Button>
            
            <Button variant="outline" onClick={previewReport}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Canvas (hidden) */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// List icon component
const List = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);