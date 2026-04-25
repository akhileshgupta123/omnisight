import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, getCurrentUserId } from 'lyzr-architect'
import getAlertModel from '@/models/alert'

async function handler(req: NextRequest) {
  try {
    const Model = await getAlertModel()
    if (req.method === 'GET') {
      const data = await Model.find({})
      return NextResponse.json({ success: true, data })
    }
    if (req.method === 'POST') {
      const body = await req.json()
      const doc = await Model.create({ ...body, owner_user_id: getCurrentUserId() })
      return NextResponse.json({ success: true, data: doc })
    }
    if (req.method === 'PATCH') {
      const body = await req.json()
      const { id, ...update } = body
      const doc = await Model.findByIdAndUpdate(id, update, { new: true })
      return NextResponse.json({ success: true, data: doc })
    }
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

const protectedHandler = authMiddleware(handler)
export const GET = protectedHandler
export const POST = protectedHandler
export const PATCH = protectedHandler
