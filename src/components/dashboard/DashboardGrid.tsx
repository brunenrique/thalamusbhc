'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import RGL, { Layout } from 'react-grid-layout';
import ScheduleWidget from './widgets/ScheduleWidget';
import TasksWidget from './widgets/TasksWidget';
import StatsWidget from './widgets/StatsWidget';
import {
  fetchDashboardLayout,
  saveDashboardLayout,
  GridItem,
} from '@/services/dashboardLayoutService';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const defaultLayout: GridItem[] = [
  { id: 'stats', x: 0, y: 0, w: 12, h: 4 },
  { id: 'schedule', x: 0, y: 4, w: 8, h: 8 },
  { id: 'tasks', x: 8, y: 4, w: 4, h: 8 },
];

function renderWidget(id: string) {
  switch (id) {
    case 'schedule':
      return <ScheduleWidget />;
    case 'tasks':
      return <TasksWidget />;
    case 'stats':
      return <StatsWidget />;
    default:
      return null;
  }
}

export default function DashboardGrid() {
  const [layout, setLayout] = useState<GridItem[]>(defaultLayout);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchDashboardLayout().then((data) => {
      if (data?.widgets) setLayout(data.widgets);
    });
  }, []);

  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    const widgets = newLayout.map((it) => ({
      id: it.i,
      x: it.x,
      y: it.y,
      w: it.w,
      h: it.h,
    }));
    setLayout(widgets);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveDashboardLayout({ widgets });
    }, 1000);
  }, []);

  const rglLayout: Layout[] = layout.map((item) => ({
    i: item.id,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  }));

  return (
    <RGL
      className="layout"
      layout={rglLayout}
      cols={12}
      rowHeight={30}
      width={1200}
      onLayoutChange={handleLayoutChange}
    >
      {layout.map((item) => (
        <div key={item.id} data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h }}>
          {renderWidget(item.id)}
        </div>
      ))}
    </RGL>
  );
}
