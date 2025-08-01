import React from "react";
import { Calendar } from "react-native-calendars";
import { ThemedText } from "../ThemedText";

type CalendarPickerProps = {
  date: Date | null;
  chooseDate: (date: Date) => void;
};
const COLOR_PRIMARY = "#000000";
const CalendarPicker: React.FC<CalendarPickerProps> = ({
  date = new Date(),
  chooseDate,
}) => {
  const selectedDate =
    date instanceof Date
      ? date.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

  // Convert day object from onDayPress to JS Date and call chooseDate
  const handleDayPress = (day: {
    year: number;
    month: number;
    day: number;
  }) => {
    const pickedDate = new Date(day.year, day.month - 1, day.day);
    chooseDate(pickedDate);
  };

  const todayString = new Date().toISOString().split("T")[0];

  // Marked dates: selected date and today's date with a circle
  const markedDates = {
    [selectedDate]: { selected: true, selectedColor: COLOR_PRIMARY },
    [todayString]: {
      marked: true,
      dotColor: "#E08DAC",
      selected: selectedDate === todayString,
      selectedColor: COLOR_PRIMARY,
      customStyles: {
        container: { backgroundColor: "#E08DAC", borderRadius: 16 },
      },
    },
  };

  return (
    <>
      <Calendar
        style={{ width: "100%", height: 350 }}
        current={selectedDate}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: COLOR_PRIMARY, // current day text color black
          selectedDayBackgroundColor: "#FFF1E7",
          arrowColor: COLOR_PRIMARY,
          monthTextColor: COLOR_PRIMARY, // header (month/year) text color black
          textMonthFontFamily: "System",
          textDayFontFamily: "System",
          textDayHeaderFontFamily: "System",
        }}
        markingType="custom"
        markedDates={markedDates}
      />
      <ThemedText style={{ textAlign: "center", marginTop: 10 }}>
        Today's Date: {new Date().toLocaleDateString()}
      </ThemedText>
    </>
  );
};

export default CalendarPicker;
