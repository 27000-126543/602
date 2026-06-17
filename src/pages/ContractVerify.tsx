import { useState, useRef, useMemo } from 'react';
import { 
  FileCheck, 
  Upload, 
  Download, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  FileText,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  X
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { formatMoney, formatPercent, formatDate } from '@/utils/format';
import { parseContractExcel, downloadSampleExcel, ParsedContract } from '@/utils/excelParser';
import { Contract } from '@/types';

const ContractVerify = () => {
  const { getContracts, getAbnormalContracts } = useDataStore();
  const [contracts, setContracts] = useState<Contract[]>(getContracts());
  const [parsedContracts, setParsedContracts] = useState<ParsedContract[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const abnormalCount = getAbnormalContracts().length;
  const totalContracts = contracts.length;

  const filteredContracts = useMemo(() => {
    let result = contracts;
    
    if (searchText) {
      result = result.filter(c => 
        c.exhibitorName.includes(searchText) ||
        c.venueName.includes(searchText) ||
        c.boothNumber.includes(searchText)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    
    return result;
  }, [contracts, searchText, statusFilter]);

  const statusColors = {
    normal: { bg: 'bg-success-50', text: 'text-success-600', border: 'border-success-200', label: '正常' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: '警告' },
    danger: { bg: 'bg-danger-50', text: 'text-danger-600', border: 'border-danger-200', label: '危险' },
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    
    try {
      const parsed = await parseContractExcel(file);
      setParsedContracts(parsed);
      setUploadSuccess(true);
      
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('解析失败:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadSample = () => {
    downloadSampleExcel();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadSuccess(false);
    
    try {
      const parsed = await parseContractExcel(file);
      setParsedContracts(parsed);
      setUploadSuccess(true);
      
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('解析失败:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const stats = useMemo(() => {
    const normal = contracts.filter(c => c.status === 'normal').length;
    const warning = contracts.filter(c => c.status === 'warning').length;
    const danger = contracts.filter(c => c.status === 'danger').length;
    const totalFee = contracts.reduce((sum, c) => sum + c.actualFee, 0);
    return { normal, warning, danger, totalFee };
  }, [contracts]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">合同校验</h1>
          <p className="text-slate-500 mt-1">参展合同费用自动校验与异常提醒</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadSample}
            className="px-4 py-2.5 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            下载模板
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 btn-primary flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            上传合同
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-5">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">合同总数</p>
              <p className="text-2xl font-bold text-slate-800">{totalContracts}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">正常合同</p>
              <p className="text-2xl font-bold text-slate-800">{stats.normal}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">警告合同</p>
              <p className="text-2xl font-bold text-slate-800">{stats.warning}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-danger-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">异常合同</p>
              <p className="text-2xl font-bold text-slate-800">{stats.danger}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`card p-8 border-2 border-dashed transition-all ${
          uploadSuccess 
            ? 'border-success-300 bg-success-50' 
            : 'border-slate-200 hover:border-primary-300 hover:bg-primary-50/30'
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          {uploadSuccess ? (
            <div className="text-center animate-bounce-soft">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              <p className="text-lg font-semibold text-success-700">解析成功</p>
              <p className="text-sm text-success-600 mt-1">
                共解析 {parsedContracts.length} 份合同
              </p>
            </div>
          ) : isUploading ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-lg font-semibold text-slate-700">正在解析...</p>
              <p className="text-sm text-slate-500 mt-1">请稍候，正在处理Excel文件</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-lg font-semibold text-slate-700">上传参展合同Excel</p>
              <p className="text-sm text-slate-500 mt-1 mb-4">
                拖拽文件到此处，或点击下方按钮选择文件
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 btn-primary flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                选择文件
              </button>
              <p className="text-xs text-slate-400 mt-3">
                支持 .xlsx, .xls 格式，建议先下载模板
              </p>
            </>
          )}
        </div>
      </div>

      {/* 解析结果预览 */}
      {parsedContracts.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">解析结果预览</h3>
            <button
              onClick={() => setParsedContracts([])}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              清除
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">参展商名称</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">展位号</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">展位面积</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">标准费用</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">实际费用</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">费用偏差</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">状态</th>
                </tr>
              </thead>
              <tbody>
                {parsedContracts.map((contract, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-700">{contract.exhibitorName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{contract.boothNumber}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{contract.boothArea} ㎡</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{formatMoney(contract.standardFee)}</td>
                    <td className="py-3 px-4 text-sm text-slate-700 font-medium">{formatMoney(contract.actualFee)}</td>
                    <td className={`py-3 px-4 text-sm font-medium ${
                      contract.deviation > 0 ? 'text-danger-600' : 
                      contract.deviation < 0 ? 'text-success-600' : 'text-slate-600'
                    }`}>
                      {contract.deviation > 0 ? '+' : ''}{formatPercent(contract.deviation)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        contract.status === 'normal' ? 'bg-success-100 text-success-700' :
                        contract.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-danger-100 text-danger-700'
                      }`}>
                        {statusColors[contract.status as keyof typeof statusColors].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger-500" />
                <span className="text-sm font-medium text-slate-700">异常提醒</span>
              </div>
              <span className="text-sm text-slate-600">
                本次解析发现 <span className="text-danger-600 font-semibold">
                  {parsedContracts.filter(c => c.status !== 'normal').length}
                </span> 份合同费用偏差超过15%，请及时复核
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 合同列表 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">合同列表</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索合同..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input-field pl-9 w-64"
              />
            </div>
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
              {['all', 'normal', 'warning', 'danger'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    statusFilter === status
                      ? 'bg-white text-slate-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {status === 'all' ? '全部' : statusColors[status as keyof typeof statusColors].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">参展商名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">所属展馆</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">展位号</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">展位面积</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">标准费用</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">实际费用</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">费用偏差</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">签订日期</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr 
                  key={contract.id} 
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    contract.status === 'danger' ? 'bg-danger-50/30' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{contract.exhibitorName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {contract.venueName}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 font-mono">{contract.boothNumber}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{contract.boothArea} ㎡</td>
                  <td className="py-4 px-4 text-sm text-slate-500">{formatMoney(contract.standardFee)}</td>
                  <td className="py-4 px-4 text-sm font-medium text-slate-700">{formatMoney(contract.actualFee)}</td>
                  <td className="py-4 px-4">
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      contract.deviation > 0 ? 'text-danger-600' : 
                      contract.deviation < 0 ? 'text-success-600' : 'text-slate-500'
                    }`}>
                      {contract.deviation > 0 ? <TrendingUp className="w-4 h-4" /> : null}
                      {contract.deviation > 0 ? '+' : ''}{formatPercent(contract.deviation)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500">{formatDate(contract.contractDate)}</td>
                  <td className="py-4 px-4">
                    <span className={`badge ${
                      contract.status === 'normal' ? 'bg-success-100 text-success-700' :
                      contract.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-danger-100 text-danger-700'
                    }`}>
                      {statusColors[contract.status as keyof typeof statusColors].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContracts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <FileText className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">暂无合同数据</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractVerify;
