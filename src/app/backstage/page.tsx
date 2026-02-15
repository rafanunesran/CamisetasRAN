
'use client';

import React, { useEffect, useState } from 'react';
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
  Search,
  Building2,
  Shirt,
  Pencil,
  Trash2,
  Plus
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
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function BackstageDashboard() {
  const [salesData, setSalesData] = useState<any[]>([
    { name: 'Jan', sales: 4000, production: 2400 },
    { name: 'Fev', sales: 3000, production: 1398 },
    { name: 'Mar', sales: 2000, production: 9800 },
    { name: 'Abr', sales: 2780, production: 3908 },
    { name: 'Mai', sales: 1890, production: 4800 },
    { name: 'Jun', sales: 2390, production: 3800 },
  ]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([
    { id: 'SKU001', name: 'Polo Tradicional P', stock: 150, min: 50, status: 'Ok' },
    { id: 'SKU002', name: 'Polo Tradicional M', stock: 24, min: 50, status: 'Crítico' },
    { id: 'SKU003', name: 'Saia Pregueada G', stock: 89, min: 30, status: 'Ok' },
    { id: 'SKU004', name: 'Calça Social 42', stock: 12, min: 20, status: 'Alerta' },
  ]);
  const [productionOrders, setProductionOrders] = useState<any[]>([
    { id: 'ORD001', item: 'Polo Tradicional M', school: 'Sta. Maria', qty: 200, status: 'Corte', progress: 25 },
    { id: 'ORD002', item: 'Suéter de Lã', school: 'Britânico', qty: 150, status: 'Costura', progress: 60 },
    { id: 'ORD003', item: 'Shorts EF', school: 'Objetivo', qty: 500, status: 'Finalização', progress: 90 },
  ]);
  const [commissions, setCommissions] = useState<any[]>([
    { id: 'COM001', name: 'Colégio Santa Maria', role: 'Parceiro', amount: 1250.00, status: 'Aberto' },
    { id: 'COM002', name: 'Ricardo Santos', role: 'Representante', amount: 850.00, status: 'Pago' },
    { id: 'COM003', name: 'Maria Oliveira', role: 'Produção', amount: 2100.00, status: 'Processando' },
  ]);
  const [partners, setPartners] = useState<any[]>([]);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<any>({ name: '', nickname: '', pix: '' });
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>({ name: '', phone: '', partnerId: '', studentName: '' });
  const [isEditingClient, setIsEditingClient] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Sales Data
        const salesSnap = await getDocs(collection(db, 'sales'));
        if (!salesSnap.empty) setSalesData(salesSnap.docs.map(d => d.data()));

        // Fetch Inventory
        const invSnap = await getDocs(collection(db, 'inventory'));
        if (!invSnap.empty) setInventoryItems(invSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Production
        const prodSnap = await getDocs(collection(db, 'production'));
        if (!prodSnap.empty) setProductionOrders(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Commissions
        const commSnap = await getDocs(collection(db, 'commissions'));
        if (!commSnap.empty) setCommissions(commSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Partners
        const partnersSnap = await getDocs(collection(db, 'partners'));
        if (!partnersSnap.empty) setPartners(partnersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Clients
        const clientsSnap = await getDocs(collection(db, 'clients'));
        if (!clientsSnap.empty) setClients(clientsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Mantém os dados dummy em caso de erro ou banco vazio
      }
    };

    fetchData();
  }, []);

  const handleOpenPartnerModal = (partner?: any) => {
    if (partner) {
      setCurrentPartner(partner);
      setIsEditingPartner(true);
    } else {
      setCurrentPartner({ name: '', nickname: '', pix: '' });
      setIsEditingPartner(false);
    }
    setIsPartnerModalOpen(true);
  };

  const handleSavePartner = async () => {
    try {
      if (isEditingPartner && currentPartner.id) {
        await updateDoc(doc(db, 'partners', currentPartner.id), {
          name: currentPartner.name,
          nickname: currentPartner.nickname,
          pix: currentPartner.pix
        });
        setPartners(prev => prev.map(p => p.id === currentPartner.id ? { ...currentPartner } : p));
      } else {
        const docRef = await addDoc(collection(db, 'partners'), {
          name: currentPartner.name,
          nickname: currentPartner.nickname,
          pix: currentPartner.pix,
          status: 'Ativo'
        });
        setPartners(prev => [...prev, { ...currentPartner, id: docRef.id, status: 'Ativo' }]);
      }
      setIsPartnerModalOpen(false);
    } catch (e) {
      console.error("Error saving partner: ", e);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este parceiro?')) {
      try {
        await deleteDoc(doc(db, 'partners', id));
        setPartners(prev => prev.filter(p => p.id !== id));
      } catch (e) {
        console.error("Error deleting partner: ", e);
      }
    }
  };

  const handleOpenClientModal = (client?: any) => {
    if (client) {
      setCurrentClient(client);
      setIsEditingClient(true);
    } else {
      setCurrentClient({ name: '', phone: '', partnerId: '', studentName: '' });
      setIsEditingClient(false);
    }
    setIsClientModalOpen(true);
  };

  const handleSaveClient = async () => {
    try {
      const clientData = {
        name: currentClient.name,
        phone: currentClient.phone,
        partnerId: currentClient.partnerId,
        studentName: currentClient.studentName || ''
      };

      if (isEditingClient && currentClient.id) {
        await updateDoc(doc(db, 'clients', currentClient.id), clientData);
        setClients(prev => prev.map(c => c.id === currentClient.id ? { ...clientData, id: currentClient.id } : c));
      } else {
        const docRef = await addDoc(collection(db, 'clients'), { ...clientData, lastPurchase: new Date().toISOString() });
        setClients(prev => [...prev, { ...clientData, id: docRef.id, lastPurchase: new Date().toISOString() }]);
      }
      setIsClientModalOpen(false);
    } catch (e) {
      console.error("Error saving client: ", e);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteDoc(doc(db, 'clients', id));
        setClients(prev => prev.filter(c => c.id !== id));
      } catch (e) {
        console.error("Error deleting client: ", e);
      }
    }
  };

  const getPartnerName = (id: string) => {
    const partner = partners.find(p => p.id === id);
    return partner ? partner.nickname || partner.name : '-';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-16 hover:w-64 transition-[width] duration-300 ease-in-out bg-primary text-primary-foreground hidden lg:flex flex-col z-50 shadow-2xl overflow-hidden group">
        <div className="h-16 flex items-center border-b border-white/10 whitespace-nowrap relative">
          <div className="w-16 flex justify-center items-center shrink-0">
            <GraduationCap className="h-8 w-8 text-accent shrink-0" />
          </div>
          <span className="text-xl font-bold font-headline opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 absolute left-16">Backstage</span>
        </div>
        <nav className="flex-1 space-y-1 py-4 flex flex-col overflow-hidden">
          <Button variant="ghost" className="w-full justify-start h-12 px-0 hover:bg-white/10 transition-colors duration-200 relative">
            <div className="w-16 flex justify-center items-center shrink-0 h-full">
            <LayoutDashboard className="h-5 w-5 shrink-0" /> 
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 absolute left-16">Dashboard</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 px-0 hover:bg-white/10 transition-colors duration-200 relative">
            <div className="w-16 flex justify-center items-center shrink-0 h-full">
            <Package className="h-5 w-5 shrink-0" /> 
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 absolute left-16">Estoque</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 px-0 hover:bg-white/10 transition-colors duration-200 relative">
            <div className="w-16 flex justify-center items-center shrink-0 h-full">
            <Users className="h-5 w-5 shrink-0" /> 
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 absolute left-16">Clientes/Escolas</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 px-0 hover:bg-white/10 transition-colors duration-200 relative">
            <div className="w-16 flex justify-center items-center shrink-0 h-full">
            <Factory className="h-5 w-5 shrink-0" /> 
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 absolute left-16">Produção</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 px-0 hover:bg-white/10 transition-colors duration-200 relative">
            <div className="w-16 flex justify-center items-center shrink-0 h-full">
            <DollarSign className="h-5 w-5 shrink-0" /> 
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 absolute left-16">Comissões</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 px-0 hover:bg-white/10 transition-colors duration-200 relative">
            <div className="w-16 flex justify-center items-center shrink-0 h-full">
            <BarChart3 className="h-5 w-5 shrink-0" /> 
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 absolute left-16">Relatórios</span>
          </Button>
        </nav>
        <div className="mt-auto border-t border-white/10 p-2">
          <Button variant="ghost" className="w-full justify-start h-12 px-0 hover:bg-white/10 transition-colors duration-200 relative">
            <div className="w-16 flex justify-center items-center shrink-0 h-full">
            <Settings className="h-5 w-5 shrink-0" /> 
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 absolute left-16">Configurações</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:ml-16">
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
            <TabsList className="bg-white p-1 h-12 shadow-sm border w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview" className="h-full px-4 gap-2"><LayoutDashboard className="h-4 w-4" /> Visão Geral</TabsTrigger>
              <TabsTrigger value="customers" className="h-full px-4 gap-2"><Users className="h-4 w-4" /> Clientes</TabsTrigger>
              <TabsTrigger value="schools" className="h-full px-4 gap-2"><Building2 className="h-4 w-4" /> Escolas/Rev</TabsTrigger>
              <TabsTrigger value="products" className="h-full px-4 gap-2"><Shirt className="h-4 w-4" /> Produtos</TabsTrigger>
              <TabsTrigger value="inventory" className="h-full px-4 gap-2"><Package className="h-4 w-4" /> Estoque</TabsTrigger>
              <TabsTrigger value="production" className="h-full px-4 gap-2"><Factory className="h-4 w-4" /> Produção</TabsTrigger>
              <TabsTrigger value="commissions" className="h-full px-4 gap-2"><DollarSign className="h-4 w-4" /> Comissões</TabsTrigger>
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

            <TabsContent value="schools" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Escolas e Revendedores</CardTitle>
                      <CardDescription>Gerencie seus parceiros comerciais.</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenPartnerModal()}>
                      <Plus className="h-4 w-4 mr-2" /> Novo Parceiro
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome Oficial</TableHead>
                        <TableHead>Apelido (Nick)</TableHead>
                        <TableHead>Chave Pix</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell className="font-medium">{partner.name}</TableCell>
                          <TableCell>{partner.nickname}</TableCell>
                          <TableCell>{partner.pix || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenPartnerModal(partner)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeletePartner(partner.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
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
                      {inventoryItems.map((item: any) => (
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
                      {productionOrders.map((order: any) => (
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
                      {commissions.map((comm: any) => (
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

      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-xl font-bold">{isEditingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome Oficial</label>
              <Input 
                value={currentPartner.name} 
                onChange={(e) => setCurrentPartner({...currentPartner, name: e.target.value})} 
                placeholder="Razão Social ou Nome Completo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nick name (Apelido)</label>
              <Input 
                value={currentPartner.nickname} 
                onChange={(e) => setCurrentPartner({...currentPartner, nickname: e.target.value})} 
                placeholder="Nome Fantasia ou Apelido"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chave Pix (Opcional)</label>
              <Input 
                value={currentPartner.pix} 
                onChange={(e) => setCurrentPartner({...currentPartner, pix: e.target.value})} 
                placeholder="CPF, CNPJ, Email ou Aleatória"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsPartnerModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSavePartner}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {isClientModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-xl font-bold">{isEditingClient ? 'Editar Cliente' : 'Novo Cliente'}</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Cliente</label>
              <Input 
                value={currentClient.name} 
                onChange={(e) => setCurrentClient({...currentClient, name: e.target.value})} 
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input 
                value={currentClient.phone} 
                onChange={(e) => setCurrentClient({...currentClient, phone: e.target.value})} 
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Parceiro (Escola/Revendedor)</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={currentClient.partnerId}
                onChange={(e) => setCurrentClient({...currentClient, partnerId: e.target.value})}
              >
                <option value="">Selecione um parceiro...</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.nickname || p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Estudante (se escola)</label>
              <Input 
                value={currentClient.studentName} 
                onChange={(e) => setCurrentClient({...currentClient, studentName: e.target.value})} 
                placeholder="Nome do aluno"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsClientModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveClient}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
