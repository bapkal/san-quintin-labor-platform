import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface JobFormProps {
  onSubmit: (job: {
    title: string;
    pay: string;
    location: string;
    date: string;
    description?: string;
  }) => void;
}

export default function JobForm({ onSubmit }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    pay: "",
    location: "",
    date: "",
    description: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.pay && formData.location && formData.date) {
      onSubmit(formData);
      setFormData({
        title: "",
        pay: "",
        location: "",
        date: "",
        description: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Job title</Label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Tomato Picker"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pay">Pay</Label>
        <Input
          id="pay"
          type="text"
          value={formData.pay}
          onChange={(e) => setFormData({ ...formData, pay: e.target.value })}
          placeholder="e.g., $12/hr"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="e.g., Farm A, San Quintín"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Start date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add extra context, benefits, or language preferences."
        />
      </div>

      <Button type="submit" className="w-full text-base">
        Post Job
      </Button>
    </form>
  );
}

