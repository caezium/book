
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Account = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Account</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Connected Libraries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Connect your accounts to access various libraries and databases.
              (Coming soon)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;

