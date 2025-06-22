
"use client";

import { useOrders } from '@/hooks/useOrders';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, PackageSearch, ListOrdered } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();

  const isLoading = authLoading || ordersLoading;

  // Filter orders for the two tabs
  const recentOrders = orders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled');
  const historyOrders = orders; // All orders

  if (isLoading) { // Generic loading skeleton
    return (
        <div className="container mx-auto px-4 py-8">
            <SectionTitle className="mb-6">My Orders</SectionTitle>
            <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
            </div>
        </div>
    );
  }

  if (!user && !authLoading) { // User explicitly not logged in
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <SectionTitle className="mb-6">My Orders</SectionTitle>
        <Card className="max-w-md mx-auto bg-card border-border shadow-xl p-6 sm:p-8">
            <ListOrdered className="h-16 w-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-xl sm:text-2xl text-center mb-2 text-card-foreground">View Your Orders</CardTitle>
            <CardDescription className="text-center mb-6 text-muted-foreground">
                Please log in or sign up to see your order history.
            </CardDescription>
            <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/auth">Login / Sign Up</Link>
            </Button>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-6">My Orders</SectionTitle>
      
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
            <TabsTrigger value="recent">Recent Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          {recentOrders.length > 0 ? (
            <div className="space-y-6">
              {recentOrders.map((order) => (
                <Card key={order.id} className="bg-secondary border-border shadow-md overflow-hidden">
                  <CardHeader className="bg-muted/30 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <CardTitle className="text-lg text-secondary-foreground">Order ID: {order.id.substring(0,8)}...</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                Placed on: {new Date(order.orderDate).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <Badge 
                            variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                            className={cn(
                                "text-xs px-2.5 py-1",
                                order.status === 'Delivered' && 'bg-green-600 text-white',
                                order.status === 'Shipped' && 'bg-blue-500 text-white',
                                order.status === 'Processing' && 'bg-yellow-500 text-black',
                            )}
                        >
                            {order.status}
                        </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <Link href={`/products/${item.slug}`} passHref className="shrink-0">
                            <Image 
                                src={item.imageUrls[0]} 
                                alt={item.name} 
                                width={64} 
                                height={64} 
                                className="rounded-md object-cover border border-muted hover:opacity-80 transition-opacity"
                                data-ai-hint={item.dataAiHint || "order item"}
                            />
                        </Link>
                        <div className="flex-grow">
                          <Link href={`/products/${item.slug}`} passHref>
                            <p className="font-medium text-sm text-secondary-foreground hover:text-primary transition-colors">{item.name}</p>
                          </Link>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} | Price: Rs. {item.priceAtPurchase.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    <Separator className="my-3 bg-border" />
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Total: <span className="font-bold text-lg text-primary">Rs. {order.totalAmount.toFixed(2)}</span></p>
                        {order.trackingNumber && (
                             <Button variant="outline" size="sm" asChild className="text-xs">
                                <a href={`https://just4ugifts.com/track?orderId=${order.id}`} target="_blank" rel="noopener noreferrer"> {/* Example tracking link */}
                                    <PackageSearch className="mr-1.5 h-3.5 w-3.5" /> Track Package
                                </a>
                            </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border shadow-md text-center py-10">
              <CardContent>
                <PackageSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-card-foreground">No recent orders.</p>
                <p className="text-muted-foreground">Orders that are processing or shipped will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          {historyOrders.length > 0 ? (
            <div className="space-y-6">
              {historyOrders.map((order) => (
                <Card key={order.id} className="bg-secondary border-border shadow-md overflow-hidden">
                  <CardHeader className="bg-muted/30 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <CardTitle className="text-lg text-secondary-foreground">Order ID: {order.id.substring(0,8)}...</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                Placed on: {new Date(order.orderDate).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <Badge 
                            variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                            className={cn(
                                "text-xs px-2.5 py-1",
                                order.status === 'Delivered' && 'bg-green-600 text-white',
                                order.status === 'Shipped' && 'bg-blue-500 text-white',
                                order.status === 'Processing' && 'bg-yellow-500 text-black',
                            )}
                        >
                            {order.status}
                        </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <Link href={`/products/${item.slug}`} passHref className="shrink-0">
                            <Image 
                                src={item.imageUrls[0]} 
                                alt={item.name} 
                                width={64} 
                                height={64} 
                                className="rounded-md object-cover border border-muted hover:opacity-80 transition-opacity"
                                data-ai-hint={item.dataAiHint || "order item"}
                            />
                        </Link>
                        <div className="flex-grow">
                          <Link href={`/products/${item.slug}`} passHref>
                            <p className="font-medium text-sm text-secondary-foreground hover:text-primary transition-colors">{item.name}</p>
                          </Link>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} | Price: Rs. {item.priceAtPurchase.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    <Separator className="my-3 bg-border" />
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Total: <span className="font-bold text-lg text-primary">Rs. {order.totalAmount.toFixed(2)}</span></p>
                        {order.trackingNumber && (
                             <Button variant="outline" size="sm" asChild className="text-xs">
                                <a href={`https://just4ugifts.com/track?orderId=${order.id}`} target="_blank" rel="noopener noreferrer"> {/* Example tracking link */}
                                    <PackageSearch className="mr-1.5 h-3.5 w-3.5" /> Track Package
                                </a>
                            </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border shadow-md text-center py-10">
              <CardContent>
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-card-foreground">You haven't placed any orders yet.</p>
                <p className="text-muted-foreground mb-4">Start shopping to see your orders here.</p>
                <Button asChild>
                  <Link href="/products">Browse Gifts</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
