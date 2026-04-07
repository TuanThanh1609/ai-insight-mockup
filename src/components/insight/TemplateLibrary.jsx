import { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from '../ui/Modal';
import { Tabs } from '../ui/Tabs';
import { TemplateCard } from './TemplateCard';
import { ColumnTemplatePicker } from './ColumnTemplatePicker';
import { mockTemplates, INDUSTRIES } from '../../data/mockTemplates';
import { cn } from '../../lib/utils';

const industryTabs = [
  { value: 'all',       label: 'Tất cả',           icon: '🌐' },
  { value: 'fashion',   label: 'Thời trang',      icon: '👗' },
  { value: 'mebaby',    label: 'Mẹ và Bé',        icon: '🍼' },
  { value: 'cosmetics', label: 'Mỹ phẩm',          icon: '💄' },
  { value: 'spa',       label: 'Spa / Thẩm mỹ',   icon: '💆' },
  { value: 'realestate',label: 'Bất động sản',    icon: '🏠' },
  { value: 'fnb',       label: 'F&B',               icon: '🍜' },
  { value: 'travel',    label: 'Du lịch',           icon: '✈️' },
];

export function TemplateLibrary({ isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filtered = activeTab === 'all'
    ? mockTemplates
    : mockTemplates.filter((t) => t.industry === activeTab);

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  const handleSave = (template, selectedCols) => {
    onSave(template, selectedCols);
    setSelectedTemplate(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="xl">
      <ModalHeader>
        {!selectedTemplate ? (
          <div className="pr-10">
            <h2 className="font-display font-bold text-xl text-on-surface">Thư viện Template</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Chọn template để bắt đầu cài đặt Insight trong vài giây
            </p>
          </div>
        ) : (
          <div />
        )}
      </ModalHeader>

      <ModalBody className={cn(!selectedTemplate && 'pt-2', selectedTemplate && 'pt-0 pb-0')}>
        {!selectedTemplate ? (
          <div className="flex flex-col gap-6">
            {/* Platform filter */}
            <div className="bg-surface-container-low rounded-md p-1.5">
            <Tabs
              tabs={industryTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="w-full"
            />
            </div>

            {/* Template grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm text-on-surface-variant">
                  Không có template cho kênh này
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    onSelect={setSelectedTemplate}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <ColumnTemplatePicker
            template={selectedTemplate}
            onBack={handleBack}
            onSave={handleSave}
          />
        )}
      </ModalBody>
    </Modal>
  );
}
