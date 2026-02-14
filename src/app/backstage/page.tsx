
'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  TrendingUp, 
  ClipboardList, 
  DollarSign, 
  Truck,
  GraduationCap,
  BarChart3,
  Factory,
  Bell,
  Search
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from 'recharts';

// Dummy Data
const salesData = [
  { name: 'Jan', sales: 4000, production: 2400 },
  { name: 'Fev', sales: 3000, production: 1398 },
  { name: 'Mar', sales: 2000, production: 9800 },
  { name: 'Abr', sales: 2780, production: 3908 },
  { name: 'Mai', sales: 1890, production: 4800 },
  { name: 'Jun', sales: 2390, production: 3800 },
];

const inventoryItems = [
  { id: 'SKU001', name: 'Polo Tradicional P', stock: 150, min: 50, status: 'Ok' },
  { id: 'SKU002', name: 'Polo Tradicional M', stock: 24, min: 50, status: 'Crítico' },
  { id: 'SKU003', name: 'Saia Pregueada G', stock: 89, min: 30, status: 'Ok' },
  { id: 'SKU004', name: 'Calça Social 42', stock: 12, min: 20, status: 'Alerta' },
];

const productionOrders = [
  { id: 'ORD001', item: 'Polo Tradicional M', school: 'Sta. Maria', qty: 200, status: 'Corte', progress: 25 },
  { id: 'ORD002', item: 'Suéter de Lã', school: 'Britânico', qty: 150, status: 'Costura', progress: 60 },
  { id: 'ORD003', item: 'Shorts EF', school: 'Objetivo', qty: 500, status: 'Finalização', progress: 90 },
];

const commissions = [
  { id: 'COM001', name: 'Colégio Santa Maria', role: 'Parceiro', amount: 1250.00, status: 'Aberto' },
  { id: 'COM002', name: 'Ricardo Santos', role: 'Representante', amount: 850.00, status: 'Pago' },
  { id: 'COM003', name: 'Maria Oliveira', role: 'Produção', amount: 2100.00, status: 'Processando' },
];

export default function BackstageDashboard() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-accent" />
          <span className="text-xl font-bold font-headline">Backstage</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10">
            <Package className="h-4 w-4" /> Estoque
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10">
            <Users className="h-4 w-4" /> Clientes/Escolas
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10">
            <Factory className="h-4 w-4" /> Produção
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10">
            <DollarSign className="h-4 w-4" /> Comissões
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10">
            <BarChart3 className="h-4 w-4" /> Relatórios
          </Button>
        </nav>
        <div className="p-4 mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10">
            <Settings className="h-4 w-4" /> Configurações
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por pedido, produto..." className="pl-9 bg-muted/50 border-none h-9" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Admin Gestor</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <div className="h-9 w-9 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold font-headline text-primary">Painel de Controle</h1>
              <p className="text-muted-foreground">Bem-vindo ao sistema de gestão UniformeGestor.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white">Exportar Dados</Button>
              <Button className="bg-accent hover:bg-accent/90">Novo Pedido</Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white p-1 h-12 shadow-sm border">
              <TabsTrigger value="overview" className="h-full px-6">Visão Geral</TabsTrigger>
              <TabsTrigger value="inventory" className="h-full px-6">Estoque</TabsTrigger>
              <TabsTrigger value="production" className="h-full px-6">Produção</TabsTrigger>
              <TabsTrigger value="commissions" className="h-full px-6">Comissões</TabsTrigger>
              <TabsTrigger value="customers" className="h-full px-6">Clientes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Vendas do Mês</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">R$ 24.500,00</div>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> +12% em relação a Jan
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Ordens em Produção</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <p className="text-xs text-muted-foreground mt-1">450 peças no total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Comissões Pendentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">R$ 4.200,00</div>
                    <p className="text-xs text-accent mt-1">3 pagamentos em espera</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Crítico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">8</div>
                    <p className="text-xs text-destructive mt-1">Reposição imediata necessária</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendas vs Produção</CardTitle>
                    <CardDescription>Acompanhamento mensal de demanda e entrega.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="production" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Pedidos Recentes</CardTitle>
                    <CardDescription>Últimas 5 movimentações de venda.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Escola</TableHead>
                          <TableHead>Itens</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Sta. Maria</TableCell>
                          <TableCell>45 polos</TableCell>
                          <TableCell className="text-right">R$ 2.065,50</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Anglo</TableCell>
                          <TableCell>12 jaquetas</TableCell>
                          <TableCell className="text-right">R$ 1.320,00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Modelo</TableCell>
                          <TableCell>100 shorts</TableCell>
                          <TableCell className="text-right">R$ 3.500,00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
               <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Gestão de Estoque</CardTitle>
                      <CardDescription>Controle de níveis e reposição de peças.</CardDescription>
                    </div>
                    <Button variant="outline" className="flex gap-2"><Truck className="h-4 w-4" /> Registrar Entrada</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cód.</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Em Estoque</TableHead>
                        <TableHead>Mínimo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs">{item.id}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>{item.min}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'Crítico' ? 'destructive' : item.status === 'Alerta' ? 'secondary' : 'default'} className={item.status === 'Ok' ? 'bg-green-500 hover:bg-green-600' : ''}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Editar</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="production" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Controle de Produção</CardTitle>
                  <CardDescription>Acompanhe o status de fabricação em tempo real.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="grid gap-6">
                      {productionOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold flex items-center gap-2">
                                <span className="text-muted-foreground font-mono text-xs">{order.id}</span>
                                {order.item}
                              </h4>
                              <p className="text-sm text-muted-foreground">{order.school} • {order.qty} peças</p>
                            </div>
                            <Badge className="bg-primary">{order.status}</Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span>Progresso</span>
                              <span>{order.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-accent h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${order.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pagamentos e Comissões</CardTitle>
                  <CardDescription>Escolas, representantes e equipe de produção.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Beneficiário</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((comm) => (
                        <TableRow key={comm.id}>
                          <TableCell className="font-medium">{comm.name}</TableCell>
                          <TableCell>{comm.role}</TableCell>
                          <TableCell>R$ {comm.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={comm.status === 'Pago' ? 'text-green-600 border-green-600 bg-green-50' : comm.status === 'Processando' ? 'text-accent border-accent bg-accent/10' : ''}>
                              {comm.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant={comm.status === 'Aberto' ? 'default' : 'ghost'} disabled={comm.status === 'Pago'}>
                              {comm.status === 'Aberto' ? 'Pagar Agora' : 'Detalhes'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
