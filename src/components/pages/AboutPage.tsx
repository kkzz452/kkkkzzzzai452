import React from "react";
import Header from "../layout/Header";
import SubscriptionBanner from "../subscription/SubscriptionBanner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header isLoggedIn={true} subscriptionStatus="free" />
      <SubscriptionBanner status="free" />

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Біз туралы</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Aqyl AI туралы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Aqyl AI - бұл қазақ тілінде тарихи тұлғалармен, атақты
                адамдармен және арнайы жасалған AI агенттерімен сөйлесуге
                мүмкіндік беретін платформа.
              </p>
              <p>
                Біздің миссиямыз - қазақ тілі мен мәдениетін сақтау және дамыту,
                сонымен қатар қазақ тарихы мен мәдениетіне қызығушылық тудыру.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Біздің технология</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Aqyl AI озық жасанды интеллект технологияларын қолданады, соның
                ішінде табиғи тілді өңдеу (NLP) және машиналық оқыту.
              </p>
              <p>
                Біздің AI модельдеріміз қазақ тілінде сөйлесуге арнайы оқытылған
                және қазақ тарихы, әдебиеті мен мәдениеті туралы білімдермен
                толықтырылған.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Байланыс ақпараты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Email: info@aqyl-ai.kz</p>
            <p>Телефон: +7 (777) 123-4567</p>
            <p>Мекенжай: Алматы қаласы, Достық даңғылы, 123</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutPage;
