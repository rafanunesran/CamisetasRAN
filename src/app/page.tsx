
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, LogIn, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const products = [
    { id: 1, name: 'Polo Tradicional', price: 45.9, school: 'Colégio Santa Maria', image: PlaceHolderImages[0].imageUrl },
    { id: 2, name: 'Saia Pregueada', price: 65.0, school: 'Escola Internacional', image: PlaceHolderImages[1].imageUrl },
    { id: 3, name: 'Calça Social', price: 72.5, school: 'Colégio Militar', image: PlaceHolderImages[2].imageUrl },
    { id: 4, name: 'Suéter de Lã', price: 89.9, school: 'Colégio Britânico', image: PlaceHolderImages[3].imageUrl },
    { id: 5, name: 'Jaqueta Tactel', price: 110.0, school: 'Escola Modelo', image: PlaceHolderImages[4].imageUrl },
    { id: 6, name: 'Shorts de Educação Física', price: 35.0, school: 'Colégio Objetivo', image: PlaceHolderImages[5].imageUrl },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary font-headline">UniformeGestor</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#products" className="text-sm font-medium hover:text-primary transition-colors">Produtos</Link>
            <Link href="#schools" className="text-sm font-medium hover:text-primary transition-colors">Escolas</Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">Sobre</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/backstage">
              <Button variant="ghost" className="hidden sm:flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Área Administrativa
              </Button>
            </Link>
            <Button className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Ver Carrinho
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-headline">Qualidade e Conforto para o Dia a Dia Escolar</h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Uniformes personalizados para as melhores instituições de ensino. Durabilidade e design que acompanham o crescimento dos alunos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" className="font-semibold px-8" asChild>
              <Link href="#products">Ver Catálogo Completo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8" asChild>
              <Link href="/backstage">Seja um Revendedor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main id="products" className="container mx-auto px-4 py-16 flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2 font-headline">Nossos Uniformes</h2>
            <p className="text-muted-foreground">Selecione o uniforme da sua instituição abaixo.</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white px-4 py-1">Filtre por Escola</Badge>
            <Badge variant="outline" className="bg-white px-4 py-1">Todos os Tamanhos</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  data-ai-hint="school uniform"
                />
              </div>
              <CardHeader className="pb-2">
                <Badge variant="secondary" className="w-fit mb-2 text-[10px] uppercase tracking-wider">{product.school}</Badge>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{product.name}</CardTitle>
                <CardDescription>Materiais premium com alta durabilidade.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium text-muted-foreground">R$</span>
                  <span className="text-2xl font-bold text-primary">{product.price.toFixed(2).replace('.', ',')}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full flex items-center gap-2 group">
                  Adicionar
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary font-headline">UniformeGestor</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sua plataforma completa de gestão de uniformes escolares. Do design à entrega, com tecnologia e transparência.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary">Institucional</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Quem Somos</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Nossas Lojas</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Seja um Parceiro</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary">Atendimento</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Trocas e Devoluções</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Tabela de Medidas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary">Newsletter</h4>
              <p className="text-xs text-muted-foreground mb-4">Receba novidades e avisos de reposição.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button size="icon" className="shrink-0"><ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2024 UniformeGestor. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
