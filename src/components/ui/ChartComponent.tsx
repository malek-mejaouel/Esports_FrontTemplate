"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', tournaments: 4, matches: 12 },
  { name: 'Feb', tournaments: 3, matches: 15 },
  { name: 'Mar', tournaments: 5, matches: 20 },
  { name: 'Apr', tournaments: 6, matches: 18 },
  { name: 'May', tournaments: 4, matches: 25 },
  { name: 'Jun', tournaments: 7, matches: 30 },
];

const ChartComponent = () => {
  return (
    <Card className="glassmorphism rounded-xl border border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold neon-text-purple">Monthly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
              <Line type="monotone" dataKey="tournaments" stroke="hsl(var(--neon-blue))" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="matches" stroke="hsl(var(--neon-red))" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartComponent;