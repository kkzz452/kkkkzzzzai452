import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, Save, X } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  personality: z
    .string()
    .min(10, { message: "Please describe the personality in more detail" }),
  background: z
    .string()
    .min(20, { message: "Background information should be more detailed" }),
  communicationStyle: z
    .string()
    .min(1, { message: "Please select a communication style" }),
  imageUrl: z.string().optional(),
});

type CharacterFormValues = z.infer<typeof formSchema>;

interface CharacterCreationFormProps {
  onSubmit?: (values: CharacterFormValues) => void;
  initialValues?: Partial<CharacterFormValues>;
}

const CharacterCreationForm = ({
  onSubmit = () => {},
  initialValues = {
    name: "",
    personality: "",
    background: "",
    communicationStyle: "",
    imageUrl: "",
  },
}: CharacterCreationFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialValues.imageUrl || null,
  );

  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server and get a URL back
      // For this demo, we'll just create a local object URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      form.setValue("imageUrl", objectUrl);
    }
  };

  const handleSubmit = (values: CharacterFormValues) => {
    onSubmit(values);
    // In a real app, you would handle form submission here
    console.log("Character created:", values);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Өзіңіздің жеке AI кейіпкеріңізді жасаңыз
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Кейіпкер аты</FormLabel>
                    <FormControl>
                      <Input placeholder="Кейіпкер атын енгізіңіз" {...field} />
                    </FormControl>
                    <FormDescription>
                      AI кейіпкеріңізге ат таңдаңыз
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communicationStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Қарым-қатынас стилі</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Қарым-қатынас стилін таңдаңыз" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="formal">Ресми</SelectItem>
                        <SelectItem value="casual">Күнделікті</SelectItem>
                        <SelectItem value="poetic">Поэтикалық</SelectItem>
                        <SelectItem value="humorous">Әзіл</SelectItem>
                        <SelectItem value="philosophical">
                          Философиялық
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Кейіпкеріңіз пайдаланушылармен қалай сөйлесетінін таңдаңыз
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-6">
                <FormLabel className="block mb-2">Кейіпкер суреті</FormLabel>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative">
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={previewImage}
                          alt="Character preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            form.setValue("imageUrl", "");
                          }}
                          className="absolute top-1 right-1 bg-white rounded-full p-1"
                        >
                          <X size={16} className="text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <Upload size={24} className="mx-auto text-gray-400" />
                        <p className="text-xs text-gray-500 mt-1">
                          Сурет жүктеу
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="character-image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("character-image")?.click()
                      }
                    >
                      Сурет таңдау
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Ұсынылады: Шаршы сурет, 500x500px немесе үлкенірек
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="personality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Жеке қасиеттері</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Кейіпкеріңіздің жеке қасиеттерін сипаттаңыз"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Кейіпкеріңіздің ойлау және мінез-құлық ерекшеліктерін
                      анықтаңыз
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Өмірбаяндық ақпарат</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Кейіпкеріңіздің өмірбаяны, тарихы және білім қоры туралы ақпарат беріңіз"
                        className="min-h-[180px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Тиісті тарихты, сараптаманы және білім салаларын қосыңыз
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Болдырмау
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Кейіпкерді сақтау
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CharacterCreationForm;
