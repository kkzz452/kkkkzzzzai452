import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Жарамды электрондық пошта енгізіңіз" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ForgotPasswordFormProps {
  onSubmit?: (values: FormValues) => void;
  onBackToLogin?: () => void;
}

const ForgotPasswordForm = ({
  onSubmit = () => {},
  onBackToLogin = () => {},
}: ForgotPasswordFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Құпия сөзді қалпына келтіру</h1>
        <p className="text-muted-foreground mt-2">
          Құпия сөзді қалпына келтіру нұсқаулары бар электрондық хат алу үшін
          электрондық поштаңызды енгізіңіз
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Электрондық пошта</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Қалпына келтіру нұсқауларын жіберу
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Button
          variant="link"
          className="p-0 h-auto font-normal flex items-center mx-auto"
          onClick={onBackToLogin}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Кіру бетіне оралу
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
