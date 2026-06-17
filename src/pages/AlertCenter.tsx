import { useState, useMemo, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  Filter,
  Search,
  ArrowLeft,
  User,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useAuthStore } from '@/store/useAuthStore';
import { alertTypeNames, alertLevelNames, alertStatusNames } from '@/data/mock/alerts';
import { formatDateTime, formatRoleName } from '@/utils/format';
import { Alert, TabType } from '@/types';
import { useSearchParams } from 'react-router-dom';

const AlertCenter = () => {
  const { getAlerts, getAlertById, getApprovalRecords, approveAlert, rejectAlert } = useDataStore();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tab = searchParams.get('tab');
    return (tab as TabType) || 'all';
  });
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(() => {
    return searchParams.get('alertId');
  });
  const [searchText, setSearchText] = useState(() => {
    return searchParams.get('search') || '';
  });
  const [approvalComment, setApprovalComment] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');

  const alerts = getAlerts(activeTab);
  const selectedAlert = selectedAlertId ? getAlertById(selectedAlertId) : null;
  const approvalRecords = selectedAlertId ? getApprovalRecords(selectedAlertId) : [];

  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeTab !== 'all') params.tab = activeTab;
    if (selectedAlertId) params.alertId = selectedAlertId;
    if (searchText) params.search = searchText;
    setSearchParams(params, { replace: true });
  }, [activeTab, selectedAlertId, searchText, setSearchParams]);

  const getMyApprovalLevel = () => {
    if (!user) return 0;
    if (user.role === 'venue') return 1;
    if (user.role === 'region') return 2;
    if (user.role === 'headquarters') return 3;
    return 0;
  };

  const filteredAlerts = useMemo(() => {
    let result = alerts;
    
    if (searchText) {
      result = result.filter(a => 
        a.title.includes(searchText) || 
        a.venueName.includes(searchText) ||
        a.description.includes(searchText)
      );
    }
    
    return result;
  }, [alerts, searchText]);

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'all', label: '全部预警', count: getAlerts('all').length },
    { key: 'pending', label: '待处理', count: getAlerts('pending').length },
    { key: 'processing', label: '处理中', count: getAlerts('processing').length },
    { key: 'resolved', label: '已解决', count: getAlerts('resolved').length },
  ];

  const levelColors = {
    info: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-500' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' },
    danger: { bg: 'bg-danger-50', text: 'text-danger-600', border: 'border-danger-200', dot: 'bg-danger-500' },
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    resolved: 'bg-success-100 text-success-700',
    rejected: 'bg-slate-100 text-slate-600',
  };

  const getCurrentApprovalLevel = () => {
    if (!selectedAlert) return 0;
    if (selectedAlert.status === 'resolved' || selectedAlert.status === 'rejected') return 4;
    return selectedAlert.currentApprovalLevel;
  };

  const isMyTurnToApprove = () => {
    if (!selectedAlert || !user) return false;
    if (selectedAlert.status === 'resolved' || selectedAlert.status === 'rejected') return false;
    
    const myLevel = getMyApprovalLevel();
    const nextLevel = selectedAlert.currentApprovalLevel + 1;
    
    return myLevel === nextLevel;
  };

  const handleApprove = () => {
    if (!selectedAlert || !isMyTurnToApprove()) return;
    const nextLevel = selectedAlert.currentApprovalLevel + 1;
    const success = approveAlert(selectedAlert.id, nextLevel, approvalComment);
    if (success) {
      setShowApprovalModal(false);
      setApprovalComment('');
    }
  };

  const handleReject = () => {
    if (!selectedAlert || !isMyTurnToApprove()) return;
    const nextLevel = selectedAlert.currentApprovalLevel + 1;
    const success = rejectAlert(selectedAlert.id, nextLevel, approvalComment);
    if (success) {
      setShowApprovalModal(false);
      setApprovalComment('');
    }
  };

  const openApprovalModal = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const getNextLevelName = () => {
    if (!selectedAlert) return '';
    const nextLevel = selectedAlert.currentApprovalLevel + 1;
    const names = ['', '展会项目经理确认', '区域运营复核', '集团总部批准'];
    return names[nextLevel] || '';
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleAlertClick = (alertId: string) => {
    setSelectedAlertId(alertId === selectedAlertId ? null : alertId);
  };

  const myLevel = getMyApprovalLevel();

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">预警中心</h1>
          <p className="text-slate-500 mt-1">智能预警监控与三级审批流程管理</p>
        </div>
        {user && (
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
            <Info className="w-4 h-4" />
            <span>您的审批级别：第{myLevel}级 - {getNextLevelName() || '全部已完成'}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-96 flex flex-col card p-5 min-h-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索预警..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input-field pl-9 w-full"
              />
            </div>
            <button className="p-2.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              <Filter className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="flex gap-1 mb-4 p-1 bg-slate-100 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-primary-100 text-primary-600' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 -mr-2 pr-2 scrollbar-thin">
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <AlertTriangle className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">暂无预警数据</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <AlertListItem
                  key={alert.id}
                  alert={alert}
                  isSelected={selectedAlertId === alert.id}
                  isMyTurn={alert.status !== 'resolved' && alert.status !== 'rejected' && alert.currentApprovalLevel + 1 === myLevel}
                  onClick={() => handleAlertClick(alert.id)}
                  levelColors={levelColors}
                  statusColors={statusColors}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex-1 card p-6 min-h-0 overflow-y-auto scrollbar-thin">
          {selectedAlert ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setSelectedAlertId(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors -ml-2"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${levelColors[selectedAlert.level].dot} pulse-dot`}></div>
                    <span className={`text-sm font-medium ${levelColors[selectedAlert.level].text}`}>
                      {alertLevelNames[selectedAlert.level]} · {alertTypeNames[selectedAlert.type]}
                    </span>
                    <span className={`badge ${statusColors[selectedAlert.status]}`}>
                      {alertStatusNames[selectedAlert.status]}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedAlert.title}</h2>
                </div>
              </div>

              <div className={`p-5 rounded-xl ${levelColors[selectedAlert.level].bg} border ${levelColors[selectedAlert.level].border}`}>
                <p className="text-slate-700 leading-relaxed">{selectedAlert.description}</p>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>创建时间：{formatDateTime(selectedAlert.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span>关联展馆：{selectedAlert.venueName}</span>
                  </div>
                </div>
              </div>

              {selectedAlert.data && (
                <div className="grid grid-cols-3 gap-4">
                  {selectedAlert.data.visitorDropRate !== undefined && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">人流量下降率</p>
                      <p className="text-2xl font-bold text-danger-600">
                        -{selectedAlert.data.visitorDropRate}%
                      </p>
                    </div>
                  )}
                  {selectedAlert.data.satisfactionDrop !== undefined && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">满意度下降</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {selectedAlert.data.satisfactionDrop}分
                      </p>
                    </div>
                  )}
                  {selectedAlert.data.boothVacancyRate !== undefined && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">展位空置率</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {selectedAlert.data.boothVacancyRate}%
                      </p>
                    </div>
                  )}
                  {selectedAlert.data.contractDeviation !== undefined && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">合同费用偏差</p>
                      <p className="text-2xl font-bold text-danger-600">
                        {selectedAlert.data.contractDeviation}%
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">三级审批流程</h3>
                <div className="relative">
                  <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-slate-200"></div>
                  <div className="space-y-0">
                    {approvalRecords.map((record, index) => (
                      <ApprovalStepItem
                        key={record.id}
                        record={record}
                        isCurrent={getCurrentApprovalLevel() === record.level && 
                          selectedAlert.status !== 'resolved' && 
                          selectedAlert.status !== 'rejected' &&
                          record.status === 'pending'}
                        isCompleted={record.status === 'approved' || 
                          (record.level < getCurrentApprovalLevel()) ||
                          selectedAlert.status === 'resolved'}
                        isRejected={record.status === 'rejected'}
                        isLast={index === approvalRecords.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {isMyTurnToApprove() && (
                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-primary-700">待您审批</p>
                      <p className="text-sm text-primary-500">当前级别：{getNextLevelName()}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openApprovalModal('reject')}
                        className="px-5 py-2.5 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        驳回
                      </button>
                      <button
                        onClick={() => openApprovalModal('approve')}
                        className="px-5 py-2.5 btn-primary flex items-center gap-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        通过
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isMyTurnToApprove() && selectedAlert.status !== 'resolved' && selectedAlert.status !== 'rejected' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">非您审批级别</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        当前正在：{getNextLevelName()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <AlertTriangle className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">选择一条预警查看详情</p>
              <p className="text-sm mt-1">点击左侧列表中的预警项</p>
            </div>
          )}
        </div>
      </div>

      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {approvalAction === 'approve' ? '审批通过' : '审批驳回'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {approvalAction === 'approve' 
                ? '确认通过此预警的审批吗？通过后将进入下一级审批。' 
                : '确认驳回此预警吗？驳回后预警将被标记为已驳回状态。'}
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                审批意见 <span className="text-slate-400 font-normal">（可选）</span>
              </label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="请输入审批意见..."
                className="input-field w-full h-24 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={approvalAction === 'approve' ? handleApprove : handleReject}
                className={`flex-1 py-2.5 rounded-lg text-white transition-colors ${
                  approvalAction === 'approve' 
                    ? 'bg-primary-600 hover:bg-primary-700' 
                    : 'bg-danger-500 hover:bg-danger-600'
                }`}
              >
                确认{approvalAction === 'approve' ? '通过' : '驳回'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface AlertListItemProps {
  alert: Alert;
  isSelected: boolean;
  isMyTurn: boolean;
  onClick: () => void;
  levelColors: Record<string, any>;
  statusColors: Record<string, string>;
}

const AlertListItem = ({ alert, isSelected, isMyTurn, onClick, levelColors, statusColors }: AlertListItemProps) => {
  const level = levelColors[alert.level];

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all border relative ${
        isSelected 
          ? `border-primary-300 bg-primary-50 shadow-md` 
          : `border-transparent ${level.bg} hover:shadow-md`
      }`}
    >
      {isMyTurn && (
        <div className="absolute -right-1 -top-1 w-3 h-3 bg-accent-500 rounded-full pulse-dot border-2 border-white"></div>
      )}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${level.dot}`}></div>
          <span className={`text-xs font-medium ${level.text}`}>
            {alertLevelNames[alert.level]}
          </span>
        </div>
        <span className={`badge ${statusColors[alert.status]} text-xs`}>
          {alertStatusNames[alert.status]}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-1">{alert.title}</h4>
      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{alert.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{alert.venueName}</span>
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </div>
    </div>
  );
};

interface ApprovalStepItemProps {
  record: any;
  isCurrent: boolean;
  isCompleted: boolean;
  isRejected: boolean;
  isLast: boolean;
}

const ApprovalStepItem = ({ record, isCurrent, isCompleted, isRejected }: ApprovalStepItemProps) => {
  const getStatusIcon = () => {
    if (record.status === 'approved') return <CheckCircle className="w-5 h-5 text-success-500" />;
    if (record.status === 'rejected') return <XCircle className="w-5 h-5 text-danger-500" />;
    if (isCurrent) return <div className="w-5 h-5 rounded-full bg-primary-500 pulse-dot"></div>;
    return <div className="w-5 h-5 rounded-full bg-slate-200"></div>;
  };

  const getStatusText = () => {
    if (record.status === 'approved') return '已通过';
    if (record.status === 'rejected') return '已驳回';
    if (isCurrent) return '待审批';
    return '等待中';
  };

  return (
    <div className="relative pl-12 pb-6">
      <div className="absolute left-3 top-1">
        {getStatusIcon()}
      </div>
      <div className={`p-4 rounded-xl ${
        isRejected ? 'bg-danger-50 border border-danger-100' :
        isCurrent ? 'bg-primary-50 border border-primary-200' : 
        isCompleted ? 'bg-slate-50' : 'bg-slate-50/50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${
              isCompleted || isRejected ? 'text-slate-800' : 'text-slate-500'
            }`}>
              {record.levelName}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              record.status === 'approved' ? 'bg-success-100 text-success-600' :
              record.status === 'rejected' ? 'bg-danger-100 text-danger-600' :
              isCurrent ? 'bg-primary-100 text-primary-600' : 'bg-slate-200 text-slate-500'
            }`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        {record.approver ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                {record.approver} · {formatRoleName(record.approverRole)}
              </span>
            </div>
            {record.comment && (
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-600">{record.comment}</p>
              </div>
            )}
            {record.createdAt && (
              <p className="text-xs text-slate-400 mt-2">{record.createdAt}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-400">等待审批中...</p>
        )}
      </div>
    </div>
  );
};

export default AlertCenter;
