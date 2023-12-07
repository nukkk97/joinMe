"use client";
import { useRef, useState } from "react";
import GrowingTextarea from "@/components/GrowingTextarea";
import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function TweetInput() {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { postTweet, loading } = useTweet();
  const [searchQuery, setSearchQuery] = useState(""); // Initialize the state
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  function isValidDateFormat(dateString: string) {
    const regex = /^\d{4}-\d{2}-\d{2}\s\d{2}$/;
    return regex.test(dateString);
  }
  function isValidDateRange(year: number, month: number, day: number) {
    const maxDays = [31, 28 + isLeapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day >= 1 && day <= maxDays[month - 1];
  }

  function isLeapYear(year: number): number {
    return Number((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
  }
  function checkDateValid(dateString: string) {
    const parts = dateString.split(' ');
    // Split the date part (YYYY-MM-DD) into year, month, and day
    const [year, month, day] = parts[0].split('-').map(Number);

    // Extract the hour part as an integer
    const hour = parseInt(parts[1], 10);

    if (!isValidDateRange(year, month, day) || hour < 0 || hour >= 24) {
      return false;
    }
    return true;
  }
  function isEndDateValid(StartDate: string, EndDate: string): boolean {
    // Parse the StartDate and EndDate strings
    StartDate += ":00";
    EndDate += ":00";
    const startDate = new Date(StartDate);
    const endDate = new Date(EndDate);

    // Verify that the parsed dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false; // Invalid date format
    }

    // Calculate the time difference in milliseconds
    const timeDifference = endDate.getTime() - startDate.getTime();

    // Calculate the number of milliseconds in 7 days
    const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;

    // Check if the EndDate is later than the StartDate and up to 7 days apart
    return timeDifference > 0 && timeDifference <= sevenDaysInMillis;
  }
  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleTweet = async () => {
    const content = textareaRef.current?.value;
    if (!content) {
      alert('請輸入標題！');
      return;
    }
    if (!isValidDateFormat(startDate) || !isValidDateFormat(EndDate)) {
      alert('請按照YYYY-MM-DD HH形式！');
      return;
    }
    if (!checkDateValid(startDate) || !checkDateValid(EndDate)) {
      alert('這個日期不存在！');
      return;
    }
    if (!isEndDateValid(startDate, EndDate)) {
      alert('結束時間必須晚於開始時間且最多7天！');
      return;
    }
    if (!handle) {
      return;
    }
    const startTime = startDate;
    const endTime = EndDate;
    try {
      const tweetID = await postTweet({
        handle,
        content,
        startTime: startTime,
        endTime: endTime,
      });
      textareaRef.current.value = "";
      // This triggers the onInput event on the growing textarea
      // thus triggering the resize
      // For more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
      const newUrl = `/tweet/${tweetID}${window.location.search}`;
      window.location.href = newUrl;
    } catch (e) {
      console.error(e);
      alert("Error posting tweet");
    }
    closeDialog();
  }

  const handleSearch = () => {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;

    // Get the existing 'q' parameter value from the URL

    // Check if the searchQuery is empty
    if (!searchQuery) {
      // Remove the 'q' parameter from the URL
      searchParams.delete('q');
    } else {
      // Update or append the 'q' parameter in the URL
      searchParams.set('q', searchQuery);
    }

    // Construct the new URL with the modified search query
    const newUrl = `${currentUrl.origin}${currentUrl.pathname}?${searchParams.toString()}${currentUrl.hash}`;

    // Redirect to the new URL
    window.location.href = newUrl;
  };
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDialogOpen(true);
    } else {
      // If handleSave returns false, it means that the input is invalid, so we
      // don't want to close the dialog
      setDialogOpen(false);
    }
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };
  
  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };
  return (
    <div className="flex gap-4" >
      {/*<UserAvatar className="h-12 w-12" />*/}
      <div className="flex w-full flex-col px-2">

        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <div className="mb-2 mt-6">
              <p>輸入活動主題：</p>
              <GrowingTextarea
                ref={textareaRef}
                className="bg-transparent outline-none placeholder:text-gray-500"
                placeholder="標題名稱"
              />
              <div className="date-inputs">
                <div>
                  <p>開始日期：</p>
                  <input type="text" placeholder="YYYY-MM-DD HH" onChange={handleStartChange} />
                </div>
                <div>
                  <p>結束日期：</p>
                  <input type="text" placeholder="YYYY-MM-DD HH" onChange={handleEndChange} />
                </div>
              </div>
              <button
                className={cn(
                  "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
                  "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
                )}
                onClick={handleTweet}
                disabled={loading}
              >
                新增
              </button>
            </div>
          </DialogContent>

          {/*<style jsx>{`
    .date-inputs {
      display: flex;
      justify-content: space-between;
    }

    .date-inputs div {
      flex: 1;
      margin: 0 10px;
    }
  `}</style>*/}
        </Dialog>


        <div className="flex justify-end">
          <input
            type="text"
            className="outline-none"
            placeholder="在此輸入搜尋內容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={cn(
            "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )} onClick={handleSearch}>搜尋</button>
          <button className={cn(
            "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )} onClick={openDialog}>新增</button>

        </div>
      </div>
    </div>
  );
}
