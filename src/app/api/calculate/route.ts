// POST /api/calculate - Performs basic arithmetic calculations
import { NextResponse } from 'next/server';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

interface CalculateRequest {
  operation: Operation;
  a: number;
  b: number;
}

interface CalculateResponse {
  success: boolean;
  result?: number;
  error?: string;
  operation?: Operation;
  operands?: {
    a: number;
    b: number;
  };
}

export async function POST(request: Request) {
  try {
    const body: CalculateRequest = await request.json();

    // Validate required fields
    if (!body.operation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Operation is required. Supported operations: add, subtract, multiply, divide',
        } as CalculateResponse,
        { status: 400 }
      );
    }

    if (body.a === undefined || body.a === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'Operand "a" is required and must be a number',
        } as CalculateResponse,
        { status: 400 }
      );
    }

    if (body.b === undefined || body.b === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'Operand "b" is required and must be a number',
        } as CalculateResponse,
        { status: 400 }
      );
    }

    // Validate that operands are numbers
    if (typeof body.a !== 'number' || isNaN(body.a)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Operand "a" must be a valid number',
        } as CalculateResponse,
        { status: 400 }
      );
    }

    if (typeof body.b !== 'number' || isNaN(body.b)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Operand "b" must be a valid number',
        } as CalculateResponse,
        { status: 400 }
      );
    }

    // Validate operation
    const validOperations: Operation[] = ['add', 'subtract', 'multiply', 'divide'];
    if (!validOperations.includes(body.operation)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid operation "${body.operation}". Supported operations: ${validOperations.join(', ')}`,
        } as CalculateResponse,
        { status: 400 }
      );
    }

    let result: number;

    // Perform calculation
    switch (body.operation) {
      case 'add':
        result = body.a + body.b;
        break;
      case 'subtract':
        result = body.a - body.b;
        break;
      case 'multiply':
        result = body.a * body.b;
        break;
      case 'divide':
        if (body.b === 0) {
          return NextResponse.json(
            {
              success: false,
              error: 'Cannot divide by zero',
            } as CalculateResponse,
            { status: 400 }
          );
        }
        result = body.a / body.b;
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid operation',
          } as CalculateResponse,
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
      operation: body.operation,
      operands: {
        a: body.a,
        b: body.b,
      },
    } as CalculateResponse);
  } catch (error) {
    // Handle JSON parsing errors or other unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid request body. Expected JSON with operation, a, and b fields',
      } as CalculateResponse,
      { status: 400 }
    );
  }
}
