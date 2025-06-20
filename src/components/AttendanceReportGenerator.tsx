import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, FileText, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { 
  toBanglaNumber, 
  getTodayInBangla, 
  toBanglaTwoDigit,
  toEnglishNumber 
} from '@/utils/banglaUtils';

interface WingData {
  name: string;
  count: number;
}

const AttendanceReportGenerator = () => {
  const [date, setDate] = useState('');
  const [dayNight, setDayNight] = useState('দিনের বেলায়');
  const [arName, setArName] = useState('');
  const [section, setSection] = useState('১');
  const [mobile, setMobile] = useState('');
  const [schedule, setSchedule] = useState('0013(M)');
  const [wingsData, setWingsData] = useState<WingData[]>([
    { name: '0001(A)', count: 0 },
    { name: '0002(B)', count: 0 },
    { name: '0003(C)', count: 0 },
    { name: '0004(D)', count: 0 },
    { name: '0005(E)', count: 0 },
    { name: '0006(F)', count: 0 },
    { name: '0007(G)', count: 0 },
    { name: '0008(H)', count: 0 },
    { name: '0009(I)', count: 0 },
    { name: '0010(J)', count: 0 },
    { name: '0011(K)', count: 0 },
    { name: '0012(L)', count: 0 },
    { name: '0013(M)', count: 11 },
    { name: '0014(N)', count: 1 },
    { name: '0015(O)', count: 0 },
    { name: '0016(P)', count: 1 },
    { name: '0017(Q)', count: 3 }
  ]);
  const [generatedReport, setGeneratedReport] = useState('');

  useEffect(() => {
    setDate(getTodayInBangla());
  }, []);

  const handleWingCountChange = (index: number, value: string) => {
    const englishValue = toEnglishNumber(value);
    const count = parseInt(englishValue) || 0;
    
    const newWingsData = [...wingsData];
    newWingsData[index].count = count;
    setWingsData(newWingsData);
  };

  const addWing = () => {
    const newWingNumber = (wingsData.length + 1).toString().padStart(4, '0');
    const newWing = { name: `${newWingNumber}(${String.fromCharCode(65 + wingsData.length)})`, count: 0 };
    setWingsData([...wingsData, newWing]);
  };

  const removeWing = (index: number) => {
    if (wingsData.length > 1) {
      const newWingsData = wingsData.filter((_, i) => i !== index);
      setWingsData(newWingsData);
    }
  };

  const generateSectionOptions = () => {
    const options = [];
    for (let i = 1; i <= 40; i++) {
      options.push(
        <SelectItem key={i} value={toBanglaNumber(i)} className="font-bangla">
          {toBanglaNumber(i)}
        </SelectItem>
      );
    }
    return options;
  };

  const generateReport = () => {
    if (!arName.trim() || !mobile.trim() || !schedule.trim()) {
      toast.error('অনুগ্রহ করে এ.আর এর নাম, মোবাইল নম্বর ও সিডিউল উইংসের নাম দিন।');
      return;
    }

    const total = wingsData.reduce((sum, wing) => sum + wing.count, 0);
    
    let wingsOutput = '';
    wingsData.forEach(wing => {
      const formattedCount = toBanglaTwoDigit(wing.count);
      const isScheduleWing = wing.name === schedule;
      
      if (isScheduleWing) {
        wingsOutput += `⭐ উইংস ${wing.name} =  ${formattedCount} জন (আজকের সিডিউল)\n`;
      } else {
        wingsOutput += `উইংস ${wing.name} =  ${formattedCount} জন\n`;
      }
    });

    const totalBangla = toBanglaNumber(total);
    const inchargeName = `এ.আর ${arName} সেকশন- ${section}`;

    const report = `${date} 
সিডিউল ও বিশেষ গোলামীতে ${dayNight} সকল উইংস এর মোট জন উপস্থিত আছেন।

${wingsOutput}-----------------------------------------
মোট------------=    ${totalBangla} জন

বাবে রহমতে ইনচার্জ:-  
${inchargeName}  
মোবা: ${mobile}

আজকের বিশেষ গোলামির ভুল বেয়াদবির জন্য ইমাম প্রফেসর ডক্টর কুদরত এ খোদা (মা.আ.) হুজুরের নূরময় কদম মোবারকে দয়া ও ভিক্ষা চাই 🙏🙏  
যেভাবে গোলামি করলে আপনি খুশি থাকেন, আমরা যেন সে ভাবে গোলামি করতে পারি।`;

    setGeneratedReport(report);
    toast.success('রিপোর্ট সফলভাবে তৈরি হয়েছে!');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedReport);
      toast.success('রিপোর্ট কপি হয়েছে!');
    } catch (err) {
      toast.error('কপি করতে সমস্যা হয়েছে');
    }
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>উপস্থিতি রিপোর্ট</title>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Noto Sans Bengali', sans-serif; font-size: 14px; line-height: 1.6; margin: 20px; }
              pre { white-space: pre-wrap; font-family: 'Noto Sans Bengali', sans-serif; }
            </style>
          </head>
          <body>
            <pre>${generatedReport}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen font-bangla">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8" />
            📋 গোলামী রিপোর্ট জেনারেটর
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="date" className="text-blue-700 font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  তারিখ ও বার:
                </Label>
                <Input
                  id="date"
                  value={date}
                  readOnly
                  className="bg-gray-50 font-bangla text-lg mt-2"
                />
              </div>

              <div>
                <Label htmlFor="daynight" className="text-blue-700 font-semibold">
                  দিনের বেলা / রাতের বেলা নির্বাচন করুন:
                </Label>
                <Select value={dayNight} onValueChange={setDayNight}>
                  <SelectTrigger className="mt-2 font-bangla">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="দিনের বেলায়" className="font-bangla">দিনের বেলায়</SelectItem>
                    <SelectItem value="রাতের বেলায়" className="font-bangla">রাতের বেলায়</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="arName" className="text-blue-700 font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  এ.আর এর নাম:
                </Label>
                <Input
                  id="arName"
                  value={arName}
                  onChange={(e) => setArName(e.target.value)}
                  placeholder="নাম লিখুন"
                  className="font-bangla text-lg mt-2"
                />
              </div>

              <div>
                <Label htmlFor="section" className="text-blue-700 font-semibold">
                  সেকশন নির্বাচন করুন (১-৪০):
                </Label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger className="mt-2 font-bangla">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {generateSectionOptions()}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mobile" className="text-blue-700 font-semibold">
                  মোবাইল নম্বর:
                </Label>
                <Input
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="০১৭XXXXXXXX"
                  className="font-bangla text-lg mt-2"
                />
              </div>

              <div>
                <Label htmlFor="schedule" className="text-blue-700 font-semibold">
                  সিডিউল উইংসের নাম:
                </Label>
                <Input
                  id="schedule"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="font-bangla text-lg mt-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-blue-700 font-semibold">উইংস অনুযায়ী জনসংখ্যা:</Label>
                <Button 
                  onClick={addWing} 
                  variant="outline" 
                  size="sm"
                  className="font-bangla"
                >
                  + নতুন উইংস যোগ করুন
                </Button>
              </div>
              
              <div className="max-h-80 overflow-y-auto space-y-3 bg-gray-50 p-4 rounded-lg">
                {wingsData.map((wing, index) => {
                  const isScheduleWing = wing.name === schedule;
                  return (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                      isScheduleWing 
                        ? 'bg-green-100 border-2 border-green-400 shadow-md' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <div className="flex flex-col">
                        <span className="font-bangla font-medium min-w-20">{wing.name}</span>
                        {isScheduleWing && (
                          <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                            ⭐ এই উইংসের সিডিউল আজকে
                          </span>
                        )}
                      </div>
                      <span className="font-bangla">=</span>
                      <Input
                        type="text"
                        value={toBanglaNumber(wing.count)}
                        onChange={(e) => handleWingCountChange(index, e.target.value)}
                        className="w-20 text-center font-bangla"
                      />
                      <span className="font-bangla">জন</span>
                      {wingsData.length > 1 && (
                        <Button
                          onClick={() => removeWing(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <Button 
              onClick={generateReport}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg font-bangla shadow-lg"
            >
              ✍ রিপোর্ট তৈরি করুন
            </Button>
            <p className="text-sm text-gray-600 font-semibold">
              © MD SOYEB 27
            </p>
          </div>
        </CardContent>
      </Card>

      {generatedReport && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center justify-between">
              <span>📄 তৈরিকৃত রিপোর্ট</span>
              <div className="flex gap-2">
                <Button 
                  onClick={copyToClipboard}
                  variant="secondary"
                  size="sm"
                  className="font-bangla"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  কপি করুন
                </Button>
                <Button 
                  onClick={printReport}
                  variant="secondary"
                  size="sm"
                  className="font-bangla"
                >
                  🖨️ প্রিন্ট করুন
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <pre className="whitespace-pre-wrap bg-blue-50 p-6 rounded-lg font-bangla text-lg leading-relaxed border-l-4 border-blue-500 shadow-inner">
              {generatedReport}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceReportGenerator;
