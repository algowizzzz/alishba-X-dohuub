"use client";

import { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2, Eye, Star, TrendingUp } from "lucide-react";

const michelleListings = [
  {
    id: "m1",
    title: "Premium Home Cleaning",
    category: "CLEANING",
    price: 180,
    status: "ACTIVE",
    views: 1456,
    bookings: 89,
    rating: 4.9,
    revenue: 15420,
  },
  {
    id: "m2",
    title: "Executive Handyman Service",
    category: "HANDYMAN",
    price: 120,
    status: "ACTIVE",
    views: 892,
    bookings: 56,
    rating: 4.8,
    revenue: 6720,
  },
  {
    id: "m3",
    title: "Luxury Spa Experience",
    category: "BEAUTY",
    price: 250,
    status: "ACTIVE",
    views: 2134,
    bookings: 124,
    rating: 5.0,
    revenue: 31000,
  },
  {
    id: "m4",
    title: "Premium Grocery Delivery",
    category: "GROCERIES",
    price: 35,
    status: "PAUSED",
    views: 567,
    bookings: 234,
    rating: 4.7,
    revenue: 8190,
  },
];

const statusColors: Record<string, "success" | "warning"> = {
  ACTIVE: "success",
  PAUSED: "warning",
};

const totalStats = {
  listings: michelleListings.length,
  totalViews: michelleListings.reduce((sum, l) => sum + l.views, 0),
  totalBookings: michelleListings.reduce((sum, l) => sum + l.bookings, 0),
  totalRevenue: michelleListings.reduce((sum, l) => sum + l.revenue, 0),
};

export default function MichelleListingsPage() {
  const [search, setSearch] = useState("");

  const filteredListings = michelleListings.filter((listing) =>
    listing.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalLayout title="Michelle's Stores" subtitle="Manage your business identities across all service categories">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Active Listings</p>
              <p className="text-2xl font-bold">{totalStats.listings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">{totalStats.totalViews.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{totalStats.totalBookings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-success">${totalStats.totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/admin/michelle-profiles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Store
            </Button>
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-0">
                {/* Image placeholder */}
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center relative">
                  <span className="text-4xl">
                    {listing.category === "CLEANING" ? "🧹" :
                     listing.category === "HANDYMAN" ? "🔧" :
                     listing.category === "BEAUTY" ? "💅" :
                     listing.category === "GROCERIES" ? "🛒" : "📦"}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                      <p className="text-sm text-gray-500">{listing.category}</p>
                    </div>
                    <Badge variant={statusColors[listing.status]}>{listing.status}</Badge>
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-4">${listing.price}</p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="h-4 w-4" />
                      {listing.views}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      {listing.bookings}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-4 w-4 fill-yellow-500" />
                      {listing.rating}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-gray-500">
                      Revenue: <span className="font-semibold text-gray-900">${listing.revenue.toLocaleString()}</span>
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/admin/michelle-profiles/${listing.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/michelle-profiles/${listing.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
