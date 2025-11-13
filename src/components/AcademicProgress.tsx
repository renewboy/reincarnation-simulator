import { GraduationCap, BookOpen, Award } from 'lucide-react';
import type { Education, CharacterAttributes, MBTIPersonality } from '../types/game';

interface AcademicProgressProps {
  education: Education;
  attributes: CharacterAttributes;
  personality: MBTIPersonality;
  showContinueOption?: boolean;
  onContinueEducation?: () => void;
  currentAge?: number;
}

// 根据教育阶段返回进度
function getEducationProgress(stage: Education['stage']): number {
  const progressMap: Record<Education['stage'], number> = {
    'none': 0,
    'elementary': 16.67,
    'middle': 33.33,
    'high': 50,
    'bachelor': 66.67,
    'master': 83.33,
    'phd': 100,
    'completed': 100,
  };
  return progressMap[stage] || 0;
}

// 根据教育阶段返回标签
function getEducationLabel(stage: Education['stage']): string {
  const labelMap: Record<Education['stage'], string> = {
    'none': '未入学',
    'elementary': '小学',
    'middle': '中学',
    'high': '高中',
    'bachelor': '本科',
    'master': '硕士',
    'phd': '博士',
    'completed': '已完成',
  };
  return labelMap[stage] || '未知';
}

// 根据教育阶段返回图标
function getEducationIcon(stage: Education['stage']) {
  if (stage === 'bachelor' || stage === 'master' || stage === 'phd') {
    return <GraduationCap className="w-5 h-5" />;
  }
  return <BookOpen className="w-5 h-5" />;
}

// 获取下一个教育阶段选项
function getNextEducationOptions(stage: Education['stage']): string[] {
  const optionsMap: Record<Education['stage'], string[]> = {
    'none': ['elementary'],
    'elementary': ['middle'],
    'middle': ['high'],
    'high': ['bachelor'],
    'bachelor': ['master'],
    'master': ['phd'],
    'phd': ['completed'],
    'completed': [],
  };
  return optionsMap[stage] || [];
}

// 判断是否即将毕业（根据开始年龄和当前年龄判断）
function isAboutToGraduate(stage: Education['stage'], startAge?: number, currentAge?: number): boolean {
  if (!startAge || !currentAge) return false;
  
  switch (stage) {
    case 'bachelor':
      // 本科4年，只有22岁及以上才算即将毕业
      return currentAge >= 22;
    case 'master':
      // 硕士2年，只有24岁及以上才算即将毕业
      return currentAge >= 25;
    case 'phd':
      // 博士4年，只有28岁及以上才算即将毕业
      return currentAge >= 29;
    default:
      return false;
  }
}

export default function AcademicProgress({
  education,
  attributes,
  personality,
  showContinueOption = false,
  onContinueEducation,
  currentAge,
}: AcademicProgressProps) {
  const progress = getEducationProgress(education.stage);
  const currentLabel = getEducationLabel(education.stage);
  const nextOptions = getNextEducationOptions(education.stage);
  const aboutToGraduate = isAboutToGraduate(education.stage, education.startAge, currentAge);

  return (
    <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <GraduationCap className="w-6 h-6 text-blue-400" />
        <h3 className="text-white font-semibold text-lg">教育进度</h3>
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>当前阶段：{currentLabel}</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 当前教育信息 */}
      {education.major && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">当前专业</span>
          </div>
          <p className="text-gray-300">{education.major}</p>
          {education.institution && (
            <p className="text-gray-400 text-sm mt-1">学校：{education.institution}</p>
          )}
        </div>
      )}

      {/* 学术成就 */}
      {education.achievements && education.achievements.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-medium">学术成就</span>
          </div>
          <div className="space-y-1">
            {education.achievements.map((achievement, index) => (
              <div key={index} className="text-sm text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                {achievement}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 下一步选择 */}
      {showContinueOption && nextOptions.length > 0 && (
        <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <div className="text-center">
            <p className="text-purple-300 font-medium mb-3">
              {education.stage === 'high' && '恭喜完成高中学业！现在可以进入大学了。'}
              {education.stage === 'bachelor' && aboutToGraduate && '本科即将毕业！可以考虑攻读硕士。'}
              {education.stage === 'master' && aboutToGraduate && '硕士即将毕业！可以继续攻读博士。'}
            </p>
          
          </div>
        </div>
      )}

      {/* 提示信息 */}
      {education.stage === 'completed' && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="text-center">
            <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-300 font-medium">恭喜完成所有学业！</p>
          </div>
        </div>
      )}
    </div>
  );
}
