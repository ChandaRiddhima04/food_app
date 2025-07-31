import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle } from "lucide-react";
import Tesseract from "tesseract.js";

const riskDatabase = {
  "glucose syrup": ["High Sugar - Risk for Diabetes"],
  "sodium benzoate": ["Preservative - May affect blood pressure"],
  "aspartame": ["Artificial Sweetener - Caution for neurological impact"],
  "palm oil": ["Saturated Fat - Risk for Cholesterol"]
};

const healthRules = {
  diabetes: ["glucose syrup", "aspartame"],
  "high blood pressure": ["sodium benzoate"],
  cholesterol: ["palm oil"]
};

export default function IngredientScanner() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [userCondition, setUserCondition] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      setExtractedText(text);
      analyzeText(text);
    }
  };

  const analyzeText = (text) => {
    const lowerText = text.toLowerCase();
    const foundAlerts = [];

    Object.entries(riskDatabase).forEach(([ingredient, risks]) => {
      if (lowerText.includes(ingredient)) {
        risks.forEach((risk) => foundAlerts.push(`${ingredient}: ${risk}`));
      }
    });

    if (userCondition && healthRules[userCondition]) {
      healthRules[userCondition].forEach((badItem) => {
        if (lowerText.includes(badItem)) {
          foundAlerts.push(`${badItem}: Not recommended for ${userCondition}`);
        }
      });
    }

    setAlerts(foundAlerts);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Food Ingredient Health Scanner</h1>
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="mb-4">
            <Input
              placeholder="Enter your condition (e.g., diabetes, cholesterol, high blood pressure)"
              value={userCondition}
              onChange={(e) => setUserCondition(e.target.value.toLowerCase())}
            />
          </div>

          {extractedText && (
            <div className="mb-4">
              <h2 className="font-semibold mb-2">Extracted Ingredients:</h2>
              <Textarea value={extractedText} readOnly className="h-32" />
            </div>
          )}

          {alerts.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Health Alerts:</h2>
              <ul className="list-disc pl-5 text-red-600">
                {alerts.map((alert, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <AlertCircle className="text-red-500" size={18} />
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {alerts.length === 0 && extractedText && (
            <p className="text-green-600 flex items-center gap-2 mt-4">
              <CheckCircle size={20} /> No harmful ingredients found for your condition.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
