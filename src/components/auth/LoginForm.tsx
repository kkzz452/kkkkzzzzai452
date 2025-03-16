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
import { Checkbox } from "../ui/checkbox";
import { Link } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Жарамды электрондық пошта енгізіңіз" }),
  password: z
    .string()
    .min(6, { message: "Құпия сөз кемінде 6 таңбадан тұруы керек" }),
  rememberMe: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSubmit?: (values: FormValues) => void;
  onRegisterClick?: () => void;
}

const LoginForm = ({
  onSubmit = () => {},
  onRegisterClick = () => {},
}: LoginFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Aqyl AI-ға кіру</h1>
        <p className="text-muted-foreground mt-2">
          Тарихи тұлғалармен әңгімелесуді бастау үшін кіріңіз
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Құпия сөз</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Құпия сөзіңізді енгізіңіз"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Мені есте сақтау
                  </FormLabel>
                </FormItem>
              )}
            />

            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Құпия сөзді ұмыттыңыз ба?
            </Link>
          </div>

          <Button type="submit" className="w-full">
            Кіру
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Аккаунтыңыз жоқ па?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={onRegisterClick}
          >
            Тіркелу
          </Button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
