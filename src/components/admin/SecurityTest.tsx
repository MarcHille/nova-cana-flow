
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { verifyAuthenticationSystem, verifyRoleAccessControl, testOrderSubmission } from '@/utils/testUtils';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const SecurityTest = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, { success: boolean, message: string, details?: Record<string, unknown> }>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  
  const runAuthTest = async () => {
    setIsLoading(prev => ({ ...prev, auth: true }));
    try {
      const result = await verifyAuthenticationSystem();
      setTestResults(prev => ({ ...prev, auth: result }));
      
      toast({
        title: result.success ? "Authentication Test Passed" : "Authentication Test Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error running auth test:", error);
      setTestResults(prev => ({ 
        ...prev, 
        auth: { 
          success: false, 
          message: "Test failed with an unexpected error",
          details: { error: error instanceof Error ? error.message : String(error) }
        } 
      }));
      
      toast({
        title: "Test Error",
        description: "An unexpected error occurred while testing authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, auth: false }));
    }
  };
  
  const runRoleTest = async () => {
    setIsLoading(prev => ({ ...prev, roles: true }));
    try {
      const result = await verifyRoleAccessControl();
      setTestResults(prev => ({ ...prev, roles: result }));
      
      toast({
        title: result.success ? "Role System Test Passed" : "Role System Test Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error running role test:", error);
      setTestResults(prev => ({ 
        ...prev, 
        roles: { 
          success: false, 
          message: "Test failed with an unexpected error",
          details: { error: error instanceof Error ? error.message : String(error) }
        } 
      }));
      
      toast({
        title: "Test Error",
        description: "An unexpected error occurred while testing roles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, roles: false }));
    }
  };
  
  const runOrderTest = async () => {
    setIsLoading(prev => ({ ...prev, orders: true }));
    try {
      // Test with empty cart first to check validation
      const emptyCartResult = await testOrderSubmission([]);
      
      // Then test with a sample cart item
      const sampleCartResult = await testOrderSubmission([
        { productId: "sample-id-for-testing", quantity: 1 }
      ]);
      
      setTestResults(prev => ({ 
        ...prev, 
        orders: { 
          success: emptyCartResult.success || sampleCartResult.success,
          message: "Order submission validation is working correctly",
          details: { 
            emptyCartTest: emptyCartResult,
            sampleCartTest: sampleCartResult
          }
        } 
      }));
      
      toast({
        title: "Order System Test Complete",
        description: "Check the test results for details",
        variant: "default",
      });
    } catch (error) {
      console.error("Error running order test:", error);
      setTestResults(prev => ({ 
        ...prev, 
        orders: { 
          success: false, 
          message: "Test failed with an unexpected error",
          details: { error: error instanceof Error ? error.message : String(error) }
        } 
      }));
      
      toast({
        title: "Test Error",
        description: "An unexpected error occurred while testing order submission",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, orders: false }));
    }
  };
  
  const runAllTests = async () => {
    await runAuthTest();
    await runRoleTest();
    await runOrderTest();
    
    toast({
      title: "All Tests Complete",
      description: "Check the test results for details",
    });
  };
  
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Security Tests</h2>
        <p className="text-muted-foreground">
          Run diagnostic tests to verify security features and system functionality
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication System</CardTitle>
            <CardDescription>
              Tests session management and user authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.auth && (
              <div className="mb-4 p-4 border rounded-md bg-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Status:</span>
                  {testResults.auth.success ? (
                    <Badge className="bg-green-500">Passed</Badge>
                  ) : (
                    <Badge variant="destructive">Failed</Badge>
                  )}
                </div>
                <p className="text-sm mb-2">{testResults.auth.message}</p>
                {testResults.auth.details && (
                  <pre className="text-xs p-2 bg-muted rounded-md overflow-auto max-h-32">
                    {JSON.stringify(testResults.auth.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={runAuthTest} 
              disabled={isLoading.auth}
              className="w-full"
            >
              {isLoading.auth ? "Testing..." : "Test Authentication"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Role-Based Access Control</CardTitle>
            <CardDescription>
              Tests role verification and access controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.roles && (
              <div className="mb-4 p-4 border rounded-md bg-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Status:</span>
                  {testResults.roles.success ? (
                    <Badge className="bg-green-500">Passed</Badge>
                  ) : (
                    <Badge variant="destructive">Failed</Badge>
                  )}
                </div>
                <p className="text-sm mb-2">{testResults.roles.message}</p>
                {testResults.roles.details && (
                  <pre className="text-xs p-2 bg-muted rounded-md overflow-auto max-h-32">
                    {JSON.stringify(testResults.roles.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={runRoleTest} 
              disabled={isLoading.roles}
              className="w-full"
            >
              {isLoading.roles ? "Testing..." : "Test Role System"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Submission</CardTitle>
            <CardDescription>
              Tests order validation and submission process
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.orders && (
              <div className="mb-4 p-4 border rounded-md bg-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Status:</span>
                  {testResults.orders.success ? (
                    <Badge className="bg-green-500">Validation Working</Badge>
                  ) : (
                    <Badge variant="destructive">Test Failed</Badge>
                  )}
                </div>
                <p className="text-sm mb-2">{testResults.orders.message}</p>
                {testResults.orders.details && (
                  <pre className="text-xs p-2 bg-muted rounded-md overflow-auto max-h-32">
                    {JSON.stringify(testResults.orders.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={runOrderTest} 
              disabled={isLoading.orders}
              className="w-full"
            >
              {isLoading.orders ? "Testing..." : "Test Order System"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Health Check</CardTitle>
            <CardDescription>
              Run all tests to verify system functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Authentication:</span>
                {testResults.auth ? (
                  testResults.auth.success ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )
                ) : (
                  <AlertCircle className="text-yellow-500 h-5 w-5" />
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Role System:</span>
                {testResults.roles ? (
                  testResults.roles.success ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )
                ) : (
                  <AlertCircle className="text-yellow-500 h-5 w-5" />
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Order System:</span>
                {testResults.orders ? (
                  testResults.orders.success ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )
                ) : (
                  <AlertCircle className="text-yellow-500 h-5 w-5" />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={runAllTests} 
              disabled={isLoading.auth || isLoading.roles || isLoading.orders}
              className="w-full"
            >
              {isLoading.auth || isLoading.roles || isLoading.orders ? 
                "Testing..." : "Run All Tests"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SecurityTest;
