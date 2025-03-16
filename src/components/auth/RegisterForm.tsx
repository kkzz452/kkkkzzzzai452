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

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Аты кемінде 2 таңбадан тұруы керек" }),
    email: z.string().email({ message: "Жарамды электрондық пошта енгізіңіз" }),
    password: z
      .string()
      .min(6, { message: "Құпия сөз кемінде 6 таңбадан тұруы керек" }),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "Қызмет көрсету шарттарымен келісу қажет",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Құпия сөздер сәйкес келмейді",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  onSubmit?: (values: FormValues) => void;
  onLoginClick?: () => void;
}

const RegisterForm = ({
  onSubmit = () => {},
  onLoginClick = () => {},
}: RegisterFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Aqyl AI-ға тіркелу</h1>
        <p className="text-muted-foreground mt-2">
          Жеке аккаунт құру арқылы барлық мүмкіндіктерге қол жеткізіңіз
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Аты-жөні</FormLabel>
                <FormControl>
                  <Input placeholder="Аты-жөніңізді енгізіңіз" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Құпия сөзді растау</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Құпия сөзді қайталаңыз"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Мен{" "}
                    <a href="#" className="text-primary hover:underline">
                      қызмет көрсету шарттарымен
                    </a>{" "}
                    және{" "}
                    <a href="#" className="text-primary hover:underline">
                      құпиялылық саясатымен
                    </a>{" "}
                    келісемін
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Тіркелу
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Аккаунтыңыз бар ма?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={onLoginClick}
          >
            Кіру
          </Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
